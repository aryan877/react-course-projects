import { NODE_TYPES } from "@/constants/nodeTypes";
import { motion } from "framer-motion";
import { useState } from "react";

const Node = ({
  node,
  isSelected,
  isConnecting,
  connectingFrom,
  onSelect,
  onUpdate,
  onStartConnection,
  onCompleteConnection,
  onDoubleClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isConnecting) {
      onCompleteConnection(node.id);
    } else {
      onSelect(node.id);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isConnecting && !isDragging) {
      onDoubleClick(node);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => setIsDragging(false), 100); // Small delay to prevent double-click triggering
  };

  const handleDrag = (event, info) => {
    const canvas = document.querySelector(".canvas-container");
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const newX = Math.max(
      0,
      Math.min(canvasRect.width - node.width, node.x + info.delta.x)
    );
    const newY = Math.max(
      0,
      Math.min(canvasRect.height - node.height, node.y + info.delta.y)
    );

    onUpdate(node.id, {
      x: newX,
      y: newY,
    });
  };

  const handleConnectionStart = (e) => {
    e.stopPropagation();
    onStartConnection(node.id);
  };

  const isHighlighted = isConnecting && connectingFrom !== node.id;

  const renderShape = () => {
    const baseClasses = `${node.color} shadow-lg transition-all duration-200 flex items-center justify-center`;
    const stateClasses = `${isSelected ? "ring-4 ring-blue-300" : ""} ${
      isHighlighted ? "ring-2 ring-green-400 animate-pulse" : ""
    } ${
      isConnecting && connectingFrom === node.id ? "ring-2 ring-blue-400" : ""
    }`;

    const commonProps = {
      className: `${baseClasses} ${stateClasses}`,
      style: {
        width: node.width,
        height: node.height,
        filter: isDragging ? "brightness(1.1)" : "brightness(1)",
        cursor: isDragging ? "grabbing" : "grab",
      },
    };

    switch (node.type) {
      case NODE_TYPES.RECTANGLE:
        return (
          <div
            {...commonProps}
            className={`${commonProps.className} rounded-lg`}
          />
        );

      case NODE_TYPES.CIRCLE:
        return (
          <div
            {...commonProps}
            className={`${commonProps.className} rounded-full`}
          />
        );

      case NODE_TYPES.DIAMOND:
        return (
          <div
            {...commonProps}
            className={`${commonProps.className}`}
            style={{
              ...commonProps.style,
              transform: "rotate(45deg)",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false} // We handle constraints manually for better control
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      className="absolute select-none"
      style={{
        left: node.x,
        top: node.y,
        zIndex: isSelected ? 20 : isDragging ? 25 : 10,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      whileDrag={{
        scale: 1.05,
        zIndex: 30,
        rotate: node.type === NODE_TYPES.DIAMOND ? 45 : 0,
      }}
      animate={{
        scale: isHighlighted ? [1, 1.05, 1] : 1,
        opacity: isDragging ? 0.9 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        scale: isHighlighted
          ? { repeat: Infinity, duration: 1 }
          : { duration: 0.2 },
      }}
    >
      <div className="relative pointer-events-none">
        {renderShape()}

        {/* Text content */}
        <div
          className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none text-white font-medium text-sm text-center leading-tight"
          style={{
            transform:
              node.type === NODE_TYPES.DIAMOND ? "rotate(-45deg)" : "none",
            wordWrap: "break-word",
            overflow: "hidden",
          }}
        >
          {node.text}
        </div>

        {/* Connection handle */}
        {isSelected && !isConnecting && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center pointer-events-auto"
            onClick={handleConnectionStart}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title="Create connection"
          >
            <span className="text-white text-xs font-bold">+</span>
          </motion.button>
        )}

        {/* Connecting indicator */}
        {isConnecting && connectingFrom === node.id && (
          <motion.div
            className="absolute -inset-2 border-2 border-blue-400 rounded-lg pointer-events-none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Node;
