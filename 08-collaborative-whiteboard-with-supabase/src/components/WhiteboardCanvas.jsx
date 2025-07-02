import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { deleteCursor } from "@/lib/db";
import { memo, useCallback, useEffect, useRef, useState } from "react";

/**
 * The core canvas component where all drawing occurs.
 * This component sets up the `<canvas>` element and integrates the drawing and
 * interaction logic from custom hooks (`useCanvasDrawing`, `useCanvasInteraction`).
 *
 * Responsibilities:
 * - Rendering the main `<canvas>` element.
 * - Rendering the cursors of other active users in real-time.
 * - Initializing and connecting the drawing and interaction hooks.
 * - Managing local drawing state (`isDrawing`, `currentPath`).
 * - Setting the appropriate CSS cursor style based on the selected tool.
 * - Cleaning up the user's own cursor position from the database on unmount.
 *
 * @param {object} props - The component's props.
 * @returns {JSX.Element}
 */
export const WhiteboardCanvas = memo(function WhiteboardCanvas({
  whiteboardId,
  currentUser,
  tool,
  color,
  strokeWidth,
  cursors,
  elements,
  saveElement,
  deleteElements,
  updateCursorPosition,
}) {
  const canvasRef = useRef(null);
  const currentPathRef = useRef([]);

  // Local state for the drawing process, managed by this component.
  const [isDrawing, setIsDrawing] = useState(false);

  // This hook provides the functions that perform the actual drawing on the canvas context.
  // It's concerned with *how* to draw, not *when* or *why*.
  const { redrawCanvas, drawPreview, drawPath, drawSegment } = useCanvasDrawing(
    {
      canvasRef,
      elements,
      color,
      strokeWidth,
      tool,
    }
  );

  // Refs to store points during a drawing interaction (e.g., from mousedown to mouseup).
  // Using refs avoids re-renders while the user is drawing.
  const startPointRef = useRef(null);
  const lastPointRef = useRef(null);

  /**
   * Calculates the mouse coordinates relative to the canvas element.
   * This is necessary because the canvas has its own coordinate system, which may
   * differ from the page's coordinate system, especially with scaling (CSS vs. canvas resolution).
   * @param {MouseEvent} e - The mouse event.
   * @returns {{x: number, y: number}} The coordinates on the canvas.
   */
  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // This hook provides the event handlers (onMouseDown, onMouseMove, etc.).
  // It contains the logic that translates user input into drawing actions.
  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useCanvasInteraction({
      tool,
      isDrawing,
      currentUser,
      strokeWidth,
      elements,
      currentPathRef,
      startPointRef,
      lastPointRef,
      getCanvasCoordinates,
      setIsDrawing,
      updateCursorPosition,
      drawPath,
      drawSegment,
      deleteElements,
      redrawCanvas,
      drawPreview,
      saveElement,
    });

  // Effect to clean up the user's cursor from the database when they navigate away
  // or close the tab. This prevents stale cursors from being displayed.
  useEffect(() => {
    if (!whiteboardId || !currentUser?.id) return;
    // The returned function is the cleanup function.
    return () => {
      deleteCursor(whiteboardId, currentUser.id);
    };
  }, [whiteboardId, currentUser?.id]);

  // Effect to redraw the entire canvas whenever the `elements` array changes.
  // `redrawCanvas` is memoized by its hook, so this only runs when necessary.
  useEffect(() => {
    redrawCanvas();
  }, [elements, redrawCanvas]);

  /**
   * Creates a custom SVG cursor for the eraser tool.
   * The size of the cursor is dynamically adjusted based on the stroke width.
   * @returns {string} A CSS `cursor` property value.
   */
  const createEraserCursor = () => {
    const size = Math.max(strokeWidth * 2, 16);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"></path>
        <path d="m5.082 11.09 8.828 8.828"></path>
      </svg>
    `;
    return `url("data:image/svg+xml;base64,${btoa(svg)}") ${size / 2} ${
      size / 2
    }, auto`;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        // Using fixed high-resolution dimensions for the canvas.
        // It's scaled down to fit the container using CSS, which maintains quality.
        width={1920}
        height={1080}
        className="w-full h-full touch-none"
        style={{
          cursor:
            tool === "pen"
              ? "crosshair"
              : tool === "text"
              ? "text"
              : tool === "eraser"
              ? createEraserCursor()
              : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)}
      />

      {/* Render the cursors of other active users */}
      {Array.from(cursors.values()).map((cursor) => (
        <div
          key={cursor.user_id}
          className="absolute pointer-events-none z-50 transform -translate-x-2 -translate-y-2"
          style={{
            left: `${(cursor.x / 1920) * 100}%`,
            top: `${(cursor.y / 1080) * 100}%`,
          }}
        >
          {/* Cursor dot */}
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-lg relative"
            style={{ backgroundColor: cursor.profile.avatar_color }}
          >
            {/* Animated ping effect for visibility */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{ backgroundColor: cursor.profile.avatar_color }}
            />
          </div>

          {/* User name label */}
          <div className="mt-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap font-medium shadow-lg">
            {cursor.profile.display_name}
          </div>
        </div>
      ))}
    </div>
  );
});
