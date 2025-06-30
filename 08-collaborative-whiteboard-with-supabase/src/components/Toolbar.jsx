import {
  Circle,
  Eraser,
  Minus,
  Palette,
  Pen,
  Redo2,
  Settings2,
  Square,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { STROKE_WIDTHS, TOOL_COLORS } from "../utils/constants";

const tools = [
  { id: "pen", icon: Pen, label: "Pen" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "text", icon: Type, label: "Text" },
];

/**
 * The main toolbar component for the whiteboard.
 * It provides UI for:
 * - Selecting drawing tools (pen, eraser, shapes, etc.).
 * - Choosing colors and stroke widths from pop-up pickers.
 * - Performing actions like undo, redo, and clearing the canvas.
 *
 * This component is "controlled". It receives its state (current tool, color)
 * and action handlers (onUndo, onRedo) as props from the parent component (`WhiteboardApp`).
 * When a user interacts with the toolbar, it calls the appropriate handler functions
 * to update the application's central state.
 *
 * @param {object} props - The component props.
 * @returns {JSX.Element}
 */
export function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl shadow-black/10 border border-white/30 px-3 py-2">
        <div className="flex items-center gap-1">
          {/* ======================================================================== */}
          {/* Drawing Tools */}
          {/* ======================================================================== */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-200/70">
            {tools.map((toolItem) => {
              const Icon = toolItem.icon;
              return (
                <button
                  key={toolItem.id}
                  onClick={() => setTool(toolItem.id)}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    tool === toolItem.id
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={toolItem.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* ======================================================================== */}
          {/* Color Picker */}
          {/* ======================================================================== */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowStrokePicker(false);
              }}
              className="group p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              title="Color"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                <div
                  className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: color }}
                />
              </div>
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl shadow-black/20 border border-gray-200/50 p-4 z-[100] backdrop-blur-xl min-w-[240px]">
                <div className="grid grid-cols-5 gap-2">
                  {TOOL_COLORS.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => {
                        setColor(colorOption);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        color === colorOption
                          ? "border-blue-500 shadow-md shadow-blue-500/30 scale-110"
                          : "border-gray-200 hover:border-gray-300 shadow-sm"
                      }`}
                      style={{ backgroundColor: colorOption }}
                      title={colorOption}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================================== */}
          {/* Stroke Width Picker */}
          {/* ======================================================================== */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStrokePicker(!showStrokePicker);
                setShowColorPicker(false);
              }}
              className="group p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              title="Size"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                <div className="flex items-center justify-center w-4 h-4">
                  <div
                    className="rounded-full bg-gray-700"
                    style={{
                      width: `${Math.max(Math.min(strokeWidth / 2, 12), 2)}px`,
                      height: `${Math.max(Math.min(strokeWidth / 2, 12), 2)}px`,
                    }}
                  />
                </div>
              </div>
            </button>

            {showStrokePicker && (
              <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl shadow-black/20 border border-gray-200/50 p-4 z-[100] backdrop-blur-xl min-w-[200px]">
                <div className="grid grid-cols-4 gap-2">
                  {STROKE_WIDTHS.map((width) => (
                    <button
                      key={width}
                      onClick={() => {
                        setStrokeWidth(width);
                        setShowStrokePicker(false);
                      }}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 ${
                        strokeWidth === width
                          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      title={`${width}px`}
                    >
                      <div
                        className="rounded-full bg-gray-700"
                        style={{
                          width: `${Math.max(width / 2, 2)}px`,
                          height: `${Math.max(width / 2, 2)}px`,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================================== */}
          {/* Actions (Undo, Redo, Clear) */}
          {/* ======================================================================== */}
          <div className="flex items-center gap-1 pl-3 border-l border-gray-200/70">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="group p-2 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="group p-2 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClear}
              className="group p-2 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 ml-1"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
