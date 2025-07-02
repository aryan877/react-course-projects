import { getConnectionPoints } from "@/utils/geometry";
import { motion } from "framer-motion";

const Connector = ({ connection, fromNode, toNode, onDelete, isSelected }) => {
  if (!fromNode || !toNode) return null;

  const { fromPoint, toPoint } = getConnectionPoints(fromNode, toNode);

  // Calculate control points for a curved line
  const midX = (fromPoint.x + toPoint.x) / 2;
  const midY = (fromPoint.y + toPoint.y) / 2;
  const distance = Math.sqrt(
    Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2)
  );

  // Dynamic curvature based on distance and direction
  const curvature = Math.min(distance * 0.25, 40);
  const isVertical =
    Math.abs(toPoint.y - fromPoint.y) > Math.abs(toPoint.x - fromPoint.x);
  const curveOffset = isVertical ? curvature : -curvature;

  const pathData = `M ${fromPoint.x} ${fromPoint.y} Q ${
    midX + curveOffset
  } ${midY} ${toPoint.x} ${toPoint.y}`;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(connection.id);
    }
  };

  const strokeColor = isSelected ? "#EF4444" : "#6B7280";
  const strokeWidth = isSelected ? 3 : 2;
  const markerEnd = isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)";

  const getDashArray = () => {
    switch (connection.style) {
      case "dashed":
        return "8,4";
      case "dotted":
        return "2,2";
      default:
        return "none";
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      exit={{ opacity: 0, pathLength: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Main path */}
      <motion.path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={markerEnd}
        className="cursor-pointer hover:stroke-red-500 transition-colors duration-200"
        onClick={handleClick}
        whileHover={{ strokeWidth: strokeWidth + 1 }}
        strokeDasharray={getDashArray()}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Invisible wider path for easier clicking */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
        className="cursor-pointer"
        onClick={handleClick}
      />

      {/* Connection label (if exists) */}
      {connection.label && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <rect
            x={midX - 20}
            y={midY - 10}
            width="40"
            height="20"
            fill="white"
            stroke={strokeColor}
            strokeWidth="1"
            rx="10"
            className="cursor-pointer"
            onClick={handleClick}
          />
          <text
            x={midX}
            y={midY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-700 pointer-events-none font-medium"
          >
            {connection.label}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
};

export default Connector;
