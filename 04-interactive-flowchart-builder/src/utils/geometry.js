export const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getNodeCenter = (node) => ({
  x: node.x + node.width / 2,
  y: node.y + node.height / 2,
});

export const getConnectionPoints = (fromNode, toNode) => {
  const fromCenter = getNodeCenter(fromNode);
  const toCenter = getNodeCenter(toNode);

  // For better connection points, calculate based on actual node bounds
  const fromBounds = getNodeBounds(fromNode);
  const toBounds = getNodeBounds(toNode);

  const fromPoint = getEdgePoint(fromBounds, fromCenter, toCenter);
  const toPoint = getEdgePoint(toBounds, toCenter, fromCenter);

  return { fromPoint, toPoint };
};

export const getNodeBounds = (node) => ({
  left: node.x,
  right: node.x + node.width,
  top: node.y,
  bottom: node.y + node.height,
  centerX: node.x + node.width / 2,
  centerY: node.y + node.height / 2,
});

export const getEdgePoint = (bounds, fromCenter, toCenter) => {
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  if (dx === 0 && dy === 0) return fromCenter;

  // Calculate intersection with rectangle edges
  const slope = dy / dx;
  let x, y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Connection is more horizontal
    if (dx > 0) {
      // Going right
      x = bounds.right;
      y = fromCenter.y + slope * (x - fromCenter.x);
    } else {
      // Going left
      x = bounds.left;
      y = fromCenter.y + slope * (x - fromCenter.x);
    }
  } else {
    // Connection is more vertical
    if (dy > 0) {
      // Going down
      y = bounds.bottom;
      x = fromCenter.x + (y - fromCenter.y) / slope;
    } else {
      // Going up
      y = bounds.top;
      x = fromCenter.x + (y - fromCenter.y) / slope;
    }
  }

  // Clamp to node bounds
  x = Math.max(bounds.left, Math.min(bounds.right, x));
  y = Math.max(bounds.top, Math.min(bounds.bottom, y));

  return { x, y };
};

export const isPointInNode = (point, node) => {
  return (
    point.x >= node.x &&
    point.x <= node.x + node.width &&
    point.y >= node.y &&
    point.y <= node.y + node.height
  );
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const normalizeAngle = (angle) => {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const getQuadraticBezierPoint = (p0, p1, p2, t) => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
};
