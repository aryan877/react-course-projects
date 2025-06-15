import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import TextEditor from "./components/TextEditor";
import Toolbar from "./components/Toolbar";
import { useFlowchart } from "./hooks/useFlowchart";

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [notification, setNotification] = useState(null);

  const {
    nodes,
    connections,
    selectedNode,
    isConnecting,
    connectingFrom,
    canvasRef,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    startConnection,
    completeConnection,
    cancelConnection,
    deleteConnection,
    undo,
    redo,
    canUndo,
    canRedo,
    saveFlowchart,
    loadFlowchart,
    clearCanvas,
  } = useFlowchart();

  // Listen for save/load events
  useEffect(() => {
    const handleSave = () => {
      setNotification({
        type: "success",
        message: "Flowchart saved successfully!",
      });
    };

    const handleLoad = () => {
      setNotification({
        type: "success",
        message: "Flowchart loaded successfully!",
      });
    };

    window.addEventListener("flowchart-saved", handleSave);
    window.addEventListener("flowchart-loaded", handleLoad);

    return () => {
      window.removeEventListener("flowchart-saved", handleSave);
      window.removeEventListener("flowchart-loaded", handleLoad);
    };
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCanvasClick = useCallback(
    (position) => {
      if (isConnecting) {
        cancelConnection();
      } else if (selectedTool) {
        addNode(selectedTool, position);
        setSelectedTool(null); // Clear tool after adding node
      } else {
        setSelectedNode(null);
      }
    },
    [isConnecting, selectedTool, addNode, cancelConnection, setSelectedNode]
  );

  const handleNodeDoubleClick = useCallback((node) => {
    setEditingNode(node);
  }, []);

  const handleTextSave = useCallback(
    (text) => {
      if (editingNode) {
        updateNode(editingNode.id, { text });
        setEditingNode(null);
      }
    },
    [editingNode, updateNode]
  );

  const handleTextCancel = useCallback(() => {
    setEditingNode(null);
  }, []);

  const handleExport = useCallback(() => {
    try {
      const data = {
        nodes,
        connections,
        version: "1.0",
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flowchart-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setNotification({
        type: "success",
        message: "Flowchart exported successfully!",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setNotification({
        type: "error",
        message: "Export failed. Please try again.",
      });
    }
  }, [nodes, connections]);

  const handleKeyDown = useCallback(
    (e) => {
      // Don't handle shortcuts when editing text or when focused on input elements
      if (
        editingNode ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      )
        return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedNode) {
        e.preventDefault();
        deleteNode(selectedNode);
        setNotification({
          type: "success",
          message: "Node deleted successfully!",
        });
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (isConnecting) {
          cancelConnection();
        } else {
          setSelectedNode(null);
          setSelectedTool(null);
        }
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          saveFlowchart();
        } else if (e.key === "o") {
          e.preventDefault();
          loadFlowchart();
        }
      }
    },
    [
      editingNode,
      selectedNode,
      deleteNode,
      isConnecting,
      cancelConnection,
      setSelectedNode,
      undo,
      redo,
      saveFlowchart,
      loadFlowchart,
    ]
  );

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDownGlobal = (e) => handleKeyDown(e);
    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => window.removeEventListener("keydown", handleKeyDownGlobal);
  }, [handleKeyDown]);

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-hidden relative">
      {/* Canvas - Full screen background */}
      <Canvas
        nodes={nodes}
        connections={connections}
        selectedNode={selectedNode}
        isConnecting={isConnecting}
        connectingFrom={connectingFrom}
        selectedTool={selectedTool}
        onNodeSelect={setSelectedNode}
        onNodeUpdate={updateNode}
        onNodeDoubleClick={handleNodeDoubleClick}
        onStartConnection={startConnection}
        onCompleteConnection={completeConnection}
        onCanvasClick={handleCanvasClick}
        onDeleteConnection={deleteConnection}
        canvasRef={canvasRef}
      />

      {/* Toolbar - Floating on top */}
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onUndo={undo}
        onRedo={redo}
        onSave={saveFlowchart}
        onLoad={loadFlowchart}
        onClear={clearCanvas}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        selectedNode={selectedNode}
        onDeleteNode={deleteNode}
      />

      {/* Text Editor */}
      <AnimatePresence>
        {editingNode && (
          <TextEditor
            text={editingNode.text}
            onSave={handleTextSave}
            onCancel={handleTextCancel}
            position={{
              x: editingNode.x + editingNode.width / 2,
              y: editingNode.y + editingNode.height / 2,
            }}
          />
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <div className="fixed top-20 right-4 z-50">
            <div
              className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {notification.message}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts info */}
      <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 text-xs text-gray-600">
        <div className="font-medium mb-1">Keyboard Shortcuts:</div>
        <div>
          Ctrl+Z: Undo • Ctrl+Y: Redo • Ctrl+S: Save • Ctrl+O: Load • Delete:
          Remove selected
        </div>
      </div>
    </div>
  );
}

export default App;
