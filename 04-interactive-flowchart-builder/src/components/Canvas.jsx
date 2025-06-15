import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import Connector from "./Connector";
import Node from "./Node";

const Canvas = ({
  nodes,
  connections,
  selectedNode,
  isConnecting,
  connectingFrom,
  selectedTool,
  onNodeSelect,
  onNodeUpdate,
  onNodeDoubleClick,
  onStartConnection,
  onCompleteConnection,
  onCanvasClick,
  onDeleteConnection,
  canvasRef,
}) => {
  const svgRef = useRef(null);

  const handleCanvasClick = (e) => {
    // Only handle clicks on the canvas background, not on nodes or connections
    if (
      e.target === e.currentTarget ||
      e.target === svgRef.current ||
      e.target.classList.contains("canvas-background") ||
      e.target.classList.contains("canvas-container")
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      onCanvasClick(position);
    }
  };

  const handleMouseDown = (e) => {
    // Prevent text selection when dragging
    if (
      e.target.classList.contains("canvas-background") ||
      e.target === e.currentTarget
    ) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden canvas-container"
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        cursor: selectedTool
          ? "crosshair"
          : isConnecting
          ? "crosshair"
          : "default",
        userSelect: "none",
      }}
    >
      {/* Grid Pattern - this acts as the canvas background */}
      <div
        className="absolute inset-0 opacity-40 canvas-background pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Instructions overlay when empty */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Flowchart Builder
            </h3>
            <p className="text-gray-600 mb-4">
              Select a shape from the toolbar and click anywhere to add nodes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span>• Click to add nodes</span>
              <span>• Drag to move</span>
              <span>• Double-click to edit text</span>
              <span>• Select + button to connect</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* SVG for connections */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
          </marker>
        </defs>

        <AnimatePresence>
          {connections.map((connection) => {
            const fromNode = nodes.find((n) => n.id === connection.from);
            const toNode = nodes.find((n) => n.id === connection.to);

            if (!fromNode || !toNode) return null;

            return (
              <Connector
                key={connection.id}
                connection={connection}
                fromNode={fromNode}
                toNode={toNode}
                onDelete={onDeleteConnection}
                isSelected={false}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Nodes */}
      <AnimatePresence>
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isConnecting={isConnecting}
            connectingFrom={connectingFrom}
            onSelect={onNodeSelect}
            onUpdate={onNodeUpdate}
            onStartConnection={onStartConnection}
            onCompleteConnection={onCompleteConnection}
            onDoubleClick={onNodeDoubleClick}
          />
        ))}
      </AnimatePresence>

      {/* Connecting line preview */}
      {isConnecting && connectingFrom && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ zIndex: 25 }}
        >
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Click a node to connect (ESC to cancel)
          </div>
        </motion.div>
      )}

      {/* Tool indicator */}
      {selectedTool && (
        <motion.div
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-sm font-medium text-gray-700">
            Selected:{" "}
            {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} (ESC
            to cancel)
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Canvas;
