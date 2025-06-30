import { useCallback } from "react";

/**
 * A hook that encapsulates the low-level canvas drawing logic.
 * It provides functions to draw elements, paths, and previews onto the canvas,
 * abstracting away the direct Canvas 2D context manipulations.
 *
 * This hook is stateless regarding the drawing *process* (like `isDrawing`);
 * it only cares about *how* to draw things when told to do so.
 *
 * @param {object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Ref to the canvas element.
 * @param {Array<object>} params.elements - The array of all elements to be drawn.
 * @param {string} params.color - The current color for new drawings.
 * @param {number} params.strokeWidth - The current stroke width for new drawings.
 * @param {string} params.tool - The current drawing tool (used for previews).
 * @returns {{ redrawCanvas: function, drawPreview: function, drawPath: function, drawSegment: function }}
 */
export function useCanvasDrawing({
  canvasRef,
  elements,
  color,
  strokeWidth,
  tool,
}) {
  /**
   * Draws a single line segment between two points.
   * Useful for drawing parts of a path in real-time as the user moves their mouse.
   * @param {{x: number, y: number}} from - The starting point.
   * @param {{x: number, y: number}} to - The ending point.
   */
  const drawSegment = useCallback(
    (from, to) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    },
    [canvasRef, color, strokeWidth]
  );

  /**
   * Draws a complete path from an array of points.
   * @param {Array<{x: number, y: number}>} path - The array of points to connect.
   */
  const drawPath = useCallback(
    (path) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (path.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }

      ctx.stroke();
    },
    [canvasRef, color, strokeWidth]
  );

  /**
   * Clears the canvas and redraws all elements from scratch.
   * This is the main rendering function, called whenever the `elements` array changes.
   * It iterates through the elements and uses a switch statement to call the appropriate
   * drawing method for each element type.
   */
  const redrawCanvas = useCallback(
    (elementsToDelete = new Set()) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      elements.forEach((element) => {
        const isBeingDeleted = elementsToDelete.has(element.id);

        ctx.globalAlpha = isBeingDeleted ? 0.5 : 1.0;
        ctx.strokeStyle = isBeingDeleted ? "#ef4444" : element.style.color;
        ctx.lineWidth = element.style.strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        switch (element.type) {
          case "path":
            if (element.data.path && element.data.path.length > 1) {
              ctx.beginPath();
              ctx.moveTo(element.data.path[0].x, element.data.path[0].y);
              element.data.path.forEach((point) => {
                ctx.lineTo(point.x, point.y);
              });
              ctx.stroke();
            }
            break;
          case "rectangle":
            ctx.strokeRect(
              element.data.x,
              element.data.y,
              element.data.width,
              element.data.height
            );
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(
              element.data.cx,
              element.data.cy,
              element.data.radius,
              0,
              2 * Math.PI
            );
            ctx.stroke();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(element.data.x1, element.data.y1);
            ctx.lineTo(element.data.x2, element.data.y2);
            ctx.stroke();
            break;
          case "text":
            ctx.fillStyle = isBeingDeleted ? "#ef4444" : element.style.color;
            ctx.font = `${element.style.strokeWidth * 8}px Arial`;
            ctx.fillText(element.data.text, element.data.x, element.data.y);
            break;
        }
      });
      ctx.globalAlpha = 1.0;
    },
    [elements, canvasRef]
  );

  /**
   * Draws a temporary "preview" of a shape (like a rectangle, circle, or line)
   * while the user is dragging their mouse, before the shape is finalized.
   * Uses a dashed line to indicate that it's a preview.
   * @param {{x: number, y: number}} start - The starting point of the shape.
   * @param {{x: number, y: number}} end - The current mouse position.
   */
  const drawPreview = useCallback(
    (start, end) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.setLineDash([5, 5]);

      switch (tool) {
        case "rectangle": {
          const width = end.x - start.x;
          const height = end.y - start.y;
          ctx.strokeRect(start.x, start.y, width, height);
          break;
        }
        case "circle": {
          const radius = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
          );
          ctx.beginPath();
          ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        }
        case "line":
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          break;
      }

      ctx.setLineDash([]);
    },
    [canvasRef, color, strokeWidth, tool]
  );

  return { redrawCanvas, drawPreview, drawPath, drawSegment };
}
