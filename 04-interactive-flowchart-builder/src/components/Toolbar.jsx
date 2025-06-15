import { motion } from "framer-motion";
import {
  Circle,
  Diamond,
  Download,
  FolderOpen,
  Info,
  Redo,
  RotateCcw,
  Save,
  Square,
  Trash2,
  Undo,
} from "lucide-react";
import { NODE_TYPES } from "../constants/nodeTypes";

const Toolbar = ({
  selectedTool,
  onToolSelect,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onClear,
  onExport,
  canUndo,
  canRedo,
  selectedNode,
  onDeleteNode,
}) => {
  const tools = [
    {
      id: NODE_TYPES.RECTANGLE,
      icon: Square,
      label: "Rectangle (Process)",
      color: "text-blue-500",
    },
    {
      id: NODE_TYPES.CIRCLE,
      icon: Circle,
      label: "Circle (Start/End)",
      color: "text-emerald-500",
    },
    {
      id: NODE_TYPES.DIAMOND,
      icon: Diamond,
      label: "Diamond (Decision)",
      color: "text-amber-500",
    },
  ];

  const actions = [
    {
      id: "undo",
      icon: Undo,
      label: "Undo (Ctrl+Z)",
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: "Ctrl+Z",
    },
    {
      id: "redo",
      icon: Redo,
      label: "Redo (Ctrl+Y)",
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: "Ctrl+Y",
    },
    {
      id: "save",
      icon: Save,
      label: "Save (Ctrl+S)",
      onClick: onSave,
      shortcut: "Ctrl+S",
    },
    {
      id: "load",
      icon: FolderOpen,
      label: "Load (Ctrl+O)",
      onClick: onLoad,
      shortcut: "Ctrl+O",
    },
    {
      id: "export",
      icon: Download,
      label: "Export JSON",
      onClick: onExport,
    },
    {
      id: "clear",
      icon: RotateCcw,
      label: "Clear Canvas",
      onClick: onClear,
      danger: true,
    },
  ];

  const handleToolSelect = (toolId) => {
    if (selectedTool === toolId) {
      onToolSelect(null); // Deselect if already selected
    } else {
      onToolSelect(toolId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-[95vw]"
    >
      <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-3">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Node Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Add Nodes:</span>
              <span className="sm:hidden">Add:</span>
            </div>
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = selectedTool === tool.id;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`p-2.5 rounded-xl transition-all duration-200 relative group ${
                    isSelected
                      ? "bg-blue-100 border-2 border-blue-300 shadow-md"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={tool.label}
                >
                  <Icon className={`w-4 h-4 ${tool.color}`} />

                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {tool.label}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 flex-shrink-0" />

          {/* Delete Selected Node */}
          {selectedNode && (
            <>
              <motion.button
                onClick={() => onDeleteNode(selectedNode)}
                className="p-2.5 rounded-xl bg-red-50 border-2 border-transparent hover:bg-red-100 hover:border-red-200 transition-all duration-200 group flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Delete Selected Node (Delete)"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />

                {/* Tooltip */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Delete Selected (Del)
                </div>
              </motion.button>
              <div className="w-px h-6 bg-gray-300 flex-shrink-0" />
            </>
          )}

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`p-2.5 rounded-xl transition-all duration-200 relative group flex-shrink-0 ${
                    action.disabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : action.danger
                      ? "bg-red-50 border-2 border-transparent hover:bg-red-100 hover:border-red-200"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200"
                  }`}
                  whileHover={action.disabled ? {} : { scale: 1.05 }}
                  whileTap={action.disabled ? {} : { scale: 0.95 }}
                  title={action.label}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      action.disabled
                        ? "text-gray-400"
                        : action.danger
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  />

                  {/* Tooltip */}
                  {!action.disabled && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {action.label}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbar;
