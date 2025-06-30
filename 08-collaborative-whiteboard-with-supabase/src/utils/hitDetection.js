// ============================================================================
// Hit Detection Helper Functions
// These functions determine if a point is "near" a shape, which is crucial
// for the eraser tool to select and delete elements. The "threshold"
// parameter provides a tolerance, making it easier to select elements.
// ============================================================================
export const distance = (p1, p2) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

// Checks if a point is near a line segment.
export const isPointNearLine = (point, start, end, threshold) => {
  const d = distance(start, end);
  if (d === 0) return distance(point, start) < threshold;
  const t =
    ((point.x - start.x) * (end.x - start.x) +
      (point.y - start.y) * (end.y - start.y)) /
    (d * d);
  const clampedT = Math.max(0, Math.min(1, t));
  const closestPoint = {
    x: start.x + clampedT * (end.x - start.x),
    y: start.y + clampedT * (end.y - start.y),
  };
  return distance(point, closestPoint) < threshold;
};

// Checks if a point is near any segment of a multi-point path.
export const isPointNearPath = (point, path, threshold) => {
  for (let i = 0; i < path.length - 1; i++) {
    if (isPointNearLine(point, path[i], path[i + 1], threshold)) {
      return true;
    }
  }
  return false;
};

// Checks if a point is near the boundary of a rectangle.
export const isPointNearRect = (point, rect, threshold) => {
  const { x, y, width, height } = rect;
  return (
    isPointNearLine(point, { x, y }, { x: x + width, y }, threshold) ||
    isPointNearLine(
      point,
      { x: x + width, y },
      { x: x + width, y: y + height },
      threshold
    ) ||
    isPointNearLine(
      point,
      { x: x + width, y: y + height },
      { x, y: y + height },
      threshold
    ) ||
    isPointNearLine(point, { x, y: y + height }, { x, y }, threshold)
  );
};

// Checks if a point is near the circumference of a circle.
export const isPointNearCircle = (point, circle, threshold) => {
  const dist = distance(point, { x: circle.cx, y: circle.cy });
  return Math.abs(dist - circle.radius) < threshold;
};
