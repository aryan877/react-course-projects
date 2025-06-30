import { useCallback, useRef } from "react";
import {
  distance,
  isPointNearCircle,
  isPointNearLine,
  isPointNearPath,
  isPointNearRect,
} from "../utils/hitDetection";

/**
 * This hook manages the user's direct interaction with the canvas element.
 * It translates mouse events (mousedown, mousemove, mouseup) into drawing actions
 * based on the currently selected tool.
 *
 * Responsibilities:
 * - Handling the drawing lifecycle (start, move, end).
 * - Managing drawing state (`isDrawing`, `currentPath`).
 * - Using hit detection to implement the eraser tool.
 * - Handling the creation of text elements via a prompt.
 * - Calling functions from other hooks to save elements, update state, and draw on the canvas.
 *
 * @param {object} params - The parameters for the hook.
 * @returns {{ handleMouseDown: function, handleMouseMove: function, handleMouseUp: function }}
 */
export function useCanvasInteraction({
  tool,
  isDrawing,
  strokeWidth,
  elements,
  currentPathRef,
  startPointRef,
  lastPointRef,
  getCanvasCoordinates,
  setIsDrawing,
  updateCursorPosition,
  deleteElements,
  redrawCanvas,
  drawPreview,
  saveElement,
  drawSegment,
}) {
  const elementsToDeleteRef = useRef(new Set());
  /**
   * Finds the topmost element at a given point on the canvas.
   * Iterates through elements in reverse to check the most recently drawn ones first.
   * @param {{x: number, y: number}} point - The point to check.
   * @returns {object|null} The found element or null.
   */
  const findElementAtPoint = useCallback(
    (point) => {
      const threshold = strokeWidth * 2;
      // Iterate backwards to select top-most element
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        switch (el.type) {
          case "path":
            if (isPointNearPath(point, el.data.path, threshold)) return el;
            break;
          case "rectangle":
            if (isPointNearRect(point, el.data, threshold)) return el;
            break;
          case "circle":
            if (isPointNearCircle(point, el.data, threshold)) return el;
            break;
          case "line":
            if (
              isPointNearLine(
                point,
                { x: el.data.x1, y: el.data.y1 },
                { x: el.data.x2, y: el.data.y2 },
                threshold
              )
            )
              return el;
            break;
          // Text selection would be different, maybe based on bounding box
          case "text": {
            // This is a rough approximation for text selection
            const textWidth = el.data.text.length * (el.style.strokeWidth * 4);
            const textHeight = el.style.strokeWidth * 8;
            if (
              point.x >= el.data.x &&
              point.x <= el.data.x + textWidth &&
              point.y <= el.data.y &&
              point.y >= el.data.y - textHeight
            ) {
              return el;
            }
            break;
          }
          default:
            break;
        }
      }
      return null;
    },
    [strokeWidth, elements]
  );

  /**
   * Handles the `onMouseDown` event on the canvas.
   * This is the entry point for any drawing or erasing action.
   */
  const handleMouseDown = useCallback(
    (e) => {
      const point = getCanvasCoordinates(e);
      if (!point) return;

      setIsDrawing(true);
      elementsToDeleteRef.current.clear();

      if (tool === "eraser") {
        const elementToDelete = findElementAtPoint(point);
        if (elementToDelete) {
          elementsToDeleteRef.current.add(elementToDelete.id);
          redrawCanvas(elementsToDeleteRef.current);
        }
        return;
      }

      if (tool === "text") {
        const text = prompt("Enter text:");
        if (text) {
          saveElement("text", { text, x: point.x, y: point.y });
        }
        setIsDrawing(false); // Text is a single-click action
        return;
      }

      startPointRef.current = point;
      lastPointRef.current = point;

      if (tool === "pen") {
        currentPathRef.current = [point];
      }
    },
    [
      tool,
      getCanvasCoordinates,
      setIsDrawing,
      currentPathRef,
      startPointRef,
      lastPointRef,
      saveElement,
      findElementAtPoint,
      redrawCanvas,
    ]
  );

  /**
   * Handles the `onMouseMove` event on the canvas.
   * This function is responsible for real-time drawing feedback.
   */
  const handleMouseMove = useCallback(
    (e) => {
      const point = getCanvasCoordinates(e);
      if (!point) return;

      // Always update the cursor position for other users to see.
      updateCursorPosition(point.x, point.y);

      if (!isDrawing) return;

      if (tool === "pen") {
        // For the pen, draw segments as the mouse moves.
        const fromPoint = lastPointRef.current;
        lastPointRef.current = point;
        if (fromPoint) {
          drawSegment(fromPoint, point);
        }
        currentPathRef.current.push(point);
      } else if (tool === "eraser") {
        // For the eraser, continuously check for and add elements to the delete set.
        const elementToDelete = findElementAtPoint(point);
        if (
          elementToDelete &&
          !elementsToDeleteRef.current.has(elementToDelete.id)
        ) {
          elementsToDeleteRef.current.add(elementToDelete.id);
          redrawCanvas(elementsToDeleteRef.current);
        }
      } else {
        // For other tools (shapes), update the preview.
        lastPointRef.current = point;
        redrawCanvas(); // Clear previous preview
        if (startPointRef.current) {
          drawPreview(startPointRef.current, point); // Draw new preview
        }
      }
    },
    [
      getCanvasCoordinates,
      updateCursorPosition,
      isDrawing,
      tool,
      currentPathRef,
      redrawCanvas,
      drawPreview,
      startPointRef,
      drawSegment,
      findElementAtPoint,
      lastPointRef,
    ]
  );

  /**
   * Handles the `onMouseUp` event on the canvas.
   * This finalizes a drawing action, saving the resulting element.
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === "eraser") {
      if (elementsToDeleteRef.current.size > 0) {
        deleteElements(Array.from(elementsToDeleteRef.current));
      }
      elementsToDeleteRef.current.clear();
      // After deleting, the redraw is triggered by the parent's `elements` state updating.
      return;
    }

    const startPoint = startPointRef.current;
    const endPoint = lastPointRef.current;

    // For non-pen tools, clear the preview if no shape was drawn
    if (tool !== "pen" && tool !== "eraser") {
      if (!startPoint || !endPoint || distance(startPoint, endPoint) === 0) {
        redrawCanvas(); // Clear preview
        return;
      }
    }

    // Based on the tool, create and save the final element data.
    switch (tool) {
      case "pen":
        if (currentPathRef.current.length > 1) {
          saveElement("path", { path: currentPathRef.current });
        }
        break;
      case "rectangle": {
        const x = Math.min(startPoint.x, endPoint.x);
        const y = Math.min(startPoint.y, endPoint.y);
        const width = Math.abs(startPoint.x - endPoint.x);
        const height = Math.abs(startPoint.y - endPoint.y);
        if (width > 0 && height > 0) {
          saveElement("rectangle", { x, y, width, height });
        }
        break;
      }
      case "circle": {
        const radius = distance(startPoint, endPoint);
        if (radius > 1) {
          saveElement("circle", { cx: startPoint.x, cy: startPoint.y, radius });
        }
        break;
      }
      case "line":
        saveElement("line", {
          x1: startPoint.x,
          y1: startPoint.y,
          x2: endPoint.x,
          y2: endPoint.y,
        });
        break;
    }

    // Reset drawing state for the next action.
    currentPathRef.current = [];
    startPointRef.current = null;
    lastPointRef.current = null;
    // The final redraw is triggered by the `elements` state changing after `saveElement`.
  }, [
    isDrawing,
    setIsDrawing,
    tool,
    currentPathRef,
    saveElement,
    startPointRef,
    lastPointRef,
    redrawCanvas,
    deleteElements,
  ]);

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}
