import {
  deleteAllElementsForWhiteboard,
  deleteElementsByIds,
  getElementsForWhiteboard,
  insertElement,
} from "@/lib/db";
import {
  broadcastStateReplace,
  getElementsChannel,
  removeChannel,
  subscribeToElementsChannel,
} from "@/lib/realtime";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * A comprehensive hook for managing all data related to a specific whiteboard.
 * It handles:
 * - Fetching existing drawing elements for the whiteboard.
 * - Creating, updating, and deleting elements with optimistic UI updates.
 * - Subscribing to real-time channels to receive updates from other users.
 * - Broadcasting local changes to other users via real-time channels.
 * - Managing user cursor positions through the presence channel.
 *
 * This hook is the primary interface between the React application state
 * and the Supabase backend (both database and real-time).
 *
 * @param {object} params
 * @param {string} params.whiteboardId - The ID of the current whiteboard.
 * @param {import('@supabase/realtime-js').RealtimeChannel} params.presenceChannel - The Supabase presence channel instance.
 * @param {object} params.currentUser - The profile of the currently logged-in user.
 * @returns {object} An object containing the canvas state and functions to manipulate it.
 */
export function useWhiteboardData({
  whiteboardId,
  presenceChannel,
  currentUser,
}) {
  const [canvasData, setCanvasData] = useState({
    tool: "pen",
    color: "#000000",
    strokeWidth: 2,
    elements: [],
    undoStack: [],
    redoStack: [],
  });

  const { elements, color, strokeWidth, tool, undoStack, redoStack } =
    canvasData;

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const setTool = useCallback(
    (tool) => setCanvasData((prev) => ({ ...prev, tool })),
    []
  );
  const setColor = useCallback(
    (color) => setCanvasData((prev) => ({ ...prev, color })),
    []
  );
  const setStrokeWidth = useCallback(
    (strokeWidth) => setCanvasData((prev) => ({ ...prev, strokeWidth })),
    []
  );

  const broadcastState = useCallback(
    (newState) => {
      broadcastStateReplace(whiteboardId, {
        ...newState,
        sourceUserId: currentUser.id,
      });
    },
    [whiteboardId, currentUser]
  );

  /**
   * Saves a new drawing element to the database and broadcasts it to others.
   * This function uses an optimistic update approach:
   * 1. The new element is immediately added to the local state for a responsive UI.
   * 2. The element is sent to the Supabase database.
   * 3. If the insert succeeds, the change is broadcast to other clients.
   * 4. If the insert fails, the local state is rolled back to its previous state.
   * @param {string} type - The type of the element (e.g., 'path', 'rectangle').
   * @param {object} data - The geometric data for the element.
   */
  const saveElement = useCallback(
    async (type, data) => {
      if (!currentUser?.id || !whiteboardId) return;

      const newUndoStack = [...undoStack, elements];

      const element = {
        id: uuidv4(),
        whiteboard_id: whiteboardId,
        type,
        data,
        style: {
          color,
          strokeWidth,
          fill:
            tool === "rectangle" || tool === "circle"
              ? "transparent"
              : undefined,
        },
        created_by: currentUser.id,
      };

      const newElements = [...elements, element];
      const newState = {
        elements: newElements,
        undoStack: newUndoStack,
        redoStack: [],
      };

      // Optimistic update
      setCanvasData((prev) => ({ ...prev, ...newState }));

      try {
        const { error } = await insertElement(element);
        if (error) {
          // Revert on error
          setCanvasData((prev) => ({
            ...prev,
            elements,
            undoStack,
            redoStack,
          }));
          throw error;
        }
        broadcastState(newState);
      } catch (error) {
        console.error("Error saving element:", error);
      }
    },
    [
      whiteboardId,
      color,
      strokeWidth,
      tool,
      currentUser?.id,
      elements,
      undoStack,
      redoStack,
      setCanvasData,
      broadcastState,
    ]
  );

  /**
   * Deletes a set of elements from the database by their IDs.
   * @param {Array<string>} elementIds - The IDs of the elements to delete.
   */
  const deleteElements = useCallback(
    async (elementIds) => {
      if (elementIds.length === 0) return;

      const newUndoStack = [...undoStack, elements];

      const originalElements = elements;
      const newElements = originalElements.filter(
        (el) => !elementIds.includes(el.id)
      );

      const newState = {
        elements: newElements,
        undoStack: newUndoStack,
        redoStack: [],
      };
      setCanvasData((prev) => ({ ...prev, ...newState }));

      try {
        const { error } = await deleteElementsByIds(elementIds);
        if (error) {
          setCanvasData((prev) => ({
            ...prev,
            elements,
            undoStack,
            redoStack,
          })); // Revert on error
          throw error;
        }
        broadcastState(newState);
      } catch (error) {
        console.error("Error deleting elements:", error);
      }
    },
    [elements, undoStack, redoStack, setCanvasData, broadcastState]
  );

  /**
   * Deletes all elements from the current whiteboard.
   */
  const clearAllElements = useCallback(async () => {
    const newUndoStack = [...undoStack, elements];
    const originalState = { elements, undoStack, redoStack };

    const newState = {
      elements: [],
      undoStack: newUndoStack,
      redoStack: [],
    };
    setCanvasData((prev) => ({ ...prev, ...newState }));

    try {
      const { error } = await deleteAllElementsForWhiteboard(whiteboardId);
      if (error) {
        setCanvasData((prev) => ({ ...prev, ...originalState })); // Revert on error
        throw error;
      }
      broadcastState(newState);
    } catch (error) {
      console.error("Error clearing canvas:", error);
      setCanvasData((prev) => ({ ...prev, ...originalState }));
    }
  }, [
    whiteboardId,
    elements,
    undoStack,
    redoStack,
    setCanvasData,
    broadcastState,
  ]);

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previousElements = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [elements, ...redoStack];

    const newState = {
      elements: previousElements,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    };

    setCanvasData((prev) => ({ ...prev, ...newState }));
    broadcastState(newState);
  }, [canUndo, elements, undoStack, redoStack, setCanvasData, broadcastState]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const nextElements = redoStack[0];
    const newRedoStack = redoStack.slice(1);
    const newUndoStack = [...undoStack, elements];

    const newState = {
      elements: nextElements,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    };
    setCanvasData((prev) => ({ ...prev, ...newState }));
    broadcastState(newState);
  }, [canRedo, redoStack, undoStack, elements, setCanvasData, broadcastState]);

  /**
   * Tracks and broadcasts the user's cursor position over the presence channel.
   * This allows other users to see this user's cursor in real-time.
   * @param {number} x - The x-coordinate of the cursor.
   * @param {number} y - The y-coordinate of the cursor.
   */
  const updateCursorPosition = useCallback(
    (x, y) => {
      if (!currentUser?.id || !whiteboardId || !presenceChannel) return;

      presenceChannel.track({
        user_id: currentUser.id,
        x,
        y,
        profile: {
          display_name: currentUser.display_name,
          avatar_color: currentUser.avatar_color,
        },
      });
    },
    [
      currentUser?.id,
      whiteboardId,
      currentUser?.display_name,
      currentUser?.avatar_color,
      presenceChannel,
    ]
  );

  // Effect to load initial data when the component mounts or whiteboardId changes.
  const loadExistingElements = useCallback(async () => {
    try {
      const { data, error } = await getElementsForWhiteboard(whiteboardId);
      if (error) throw error;
      if (data)
        setCanvasData((prev) => ({
          ...prev,
          elements: data,
          undoStack: [],
          redoStack: [],
        }));
    } catch (error) {
      console.error("Error loading elements:", error);
    }
  }, [whiteboardId]);

  // Main effect for setting up real-time subscriptions.
  useEffect(() => {
    if (!whiteboardId || !currentUser?.id) return;

    // Fetch the initial set of elements from the database.
    loadExistingElements();

    // Get the real-time channel for element-specific events.
    const elementsChannel = getElementsChannel(whiteboardId);

    // Define handlers for incoming real-time events.
    const handlers = {
      onStateReplace: ({ payload }) => {
        if (payload) {
          // Avoid setting state if the incoming state is from the current user
          if (payload.sourceUserId === currentUser.id) return;
          setCanvasData((prev) => ({
            ...prev,
            elements: payload.elements,
            undoStack: payload.undoStack,
            redoStack: payload.redoStack,
          }));
        }
      },
    };

    // Subscribe to the channel with the defined handlers.
    subscribeToElementsChannel(elementsChannel, handlers);

    // Cleanup function: remove the channel subscription when the component unmounts.
    return () => {
      removeChannel(elementsChannel);
    };
  }, [
    whiteboardId,
    currentUser?.id,
    loadExistingElements,
    setCanvasData,
    currentUser,
  ]);

  return {
    undo,
    redo,
    saveElement,
    deleteElements,
    updateCursorPosition,
    clearAllElements,
    tool,
    color,
    strokeWidth,
    elements,
    canUndo,
    canRedo,
    setTool,
    setColor,
    setStrokeWidth,
  };
}
