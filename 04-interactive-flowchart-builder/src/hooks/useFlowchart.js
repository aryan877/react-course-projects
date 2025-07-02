import { NODE_CONFIGS } from "@/constants/nodeTypes";
import { useDebounce } from "@/hooks/useDebounce";
import { generateId } from "@/utils/geometry";
import { useCallback, useEffect, useRef, useState } from "react";

export const useFlowchart = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);
  const isInitialized = useRef(false);

  // Initialize with empty state in history
  useEffect(() => {
    if (!isInitialized.current) {
      const initialState = { nodes: [], connections: [] };
      setHistory([initialState]);
      setHistoryIndex(0);
      isInitialized.current = true;
    }
  }, []);

  const saveToHistory = useCallback(
    (newNodes, newConnections) => {
      const newState = {
        nodes: JSON.parse(JSON.stringify(newNodes)),
        connections: JSON.parse(JSON.stringify(newConnections)),
      };

      // Don't save duplicate states
      if (historyIndex >= 0) {
        const currentState = history[historyIndex];
        if (JSON.stringify(currentState) === JSON.stringify(newState)) {
          return;
        }
      }

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);

      // Limit history size to prevent memory issues
      const MAX_HISTORY = 50;
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        setHistoryIndex(newHistory.length - 1);
      }

      setHistory(newHistory);
    },
    [history, historyIndex]
  );

  // Debounced save to history for position updates
  const [debouncedSaveToHistory] = useDebounce(saveToHistory, 300);

  const addNode = useCallback(
    (type, position) => {
      const config = NODE_CONFIGS[type];
      if (!config) return;

      const newNode = {
        id: generateId(),
        type,
        x: Math.max(0, position.x - config.width / 2),
        y: Math.max(0, position.y - config.height / 2),
        width: config.width,
        height: config.height,
        text: config.label,
        color: config.color,
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setSelectedNode(newNode.id); // Auto-select new node
      saveToHistory(newNodes, connections);
    },
    [nodes, connections, saveToHistory]
  );

  const updateNode = useCallback(
    (nodeId, updates) => {
      const newNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      );
      setNodes(newNodes);

      // Use debounced save for position changes to avoid too many history entries
      if (updates.x !== undefined || updates.y !== undefined) {
        debouncedSaveToHistory(newNodes, connections);
      } else {
        // Save immediately for non-position updates (like text changes)
        saveToHistory(newNodes, connections);
      }
    },
    [nodes, connections, saveToHistory, debouncedSaveToHistory]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      const newConnections = connections.filter(
        (conn) => conn.from !== nodeId && conn.to !== nodeId
      );
      setNodes(newNodes);
      setConnections(newConnections);
      setSelectedNode(null);
      saveToHistory(newNodes, newConnections);
    },
    [nodes, connections, saveToHistory]
  );

  const startConnection = useCallback((nodeId) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const completeConnection = useCallback(
    (toNodeId) => {
      if (connectingFrom && connectingFrom !== toNodeId) {
        // Check if connection already exists
        const existingConnection = connections.find(
          (conn) =>
            (conn.from === connectingFrom && conn.to === toNodeId) ||
            (conn.from === toNodeId && conn.to === connectingFrom)
        );

        if (!existingConnection) {
          const newConnection = {
            id: generateId(),
            from: connectingFrom,
            to: toNodeId,
            style: "solid",
          };
          const newConnections = [...connections, newConnection];
          setConnections(newConnections);
          saveToHistory(nodes, newConnections);
        }
      }
      setIsConnecting(false);
      setConnectingFrom(null);
    },
    [connectingFrom, connections, nodes, saveToHistory]
  );

  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectingFrom(null);
  }, []);

  const deleteConnection = useCallback(
    (connectionId) => {
      const newConnections = connections.filter(
        (conn) => conn.id !== connectionId
      );
      setConnections(newConnections);
      saveToHistory(nodes, newConnections);
    },
    [connections, nodes, saveToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setNodes(prevState.nodes);
      setConnections(prevState.connections);
      setHistoryIndex(prevIndex);
      setSelectedNode(null);
      setIsConnecting(false);
      setConnectingFrom(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setNodes(nextState.nodes);
      setConnections(nextState.connections);
      setHistoryIndex(nextIndex);
      setSelectedNode(null);
      setIsConnecting(false);
      setConnectingFrom(null);
    }
  }, [history, historyIndex]);

  const saveFlowchart = useCallback(() => {
    try {
      const flowchart = {
        nodes,
        connections,
        version: "1.0",
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("flowchart", JSON.stringify(flowchart));

      // Show success feedback
      const event = new CustomEvent("flowchart-saved");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to save flowchart:", error);
      alert("Failed to save flowchart. Please try again.");
    }
  }, [nodes, connections]);

  const loadFlowchart = useCallback(() => {
    try {
      const saved = localStorage.getItem("flowchart");
      if (saved) {
        const flowchart = JSON.parse(saved);
        const loadedNodes = flowchart.nodes || [];
        const loadedConnections = flowchart.connections || [];

        setNodes(loadedNodes);
        setConnections(loadedConnections);
        setSelectedNode(null);
        setIsConnecting(false);
        setConnectingFrom(null);
        saveToHistory(loadedNodes, loadedConnections);

        // Show success feedback
        const event = new CustomEvent("flowchart-loaded");
        window.dispatchEvent(event);
      } else {
        alert("No saved flowchart found.");
      }
    } catch (error) {
      console.error("Failed to load flowchart:", error);
      alert("Failed to load flowchart. The saved data may be corrupted.");
    }
  }, [saveToHistory]);

  const clearCanvas = useCallback(() => {
    if (nodes.length > 0 || connections.length > 0) {
      if (
        window.confirm(
          "Are you sure you want to clear the canvas? This action cannot be undone."
        )
      ) {
        setNodes([]);
        setConnections([]);
        setSelectedNode(null);
        setIsConnecting(false);
        setConnectingFrom(null);
        saveToHistory([], []);
      }
    }
  }, [nodes.length, connections.length, saveToHistory]);

  return {
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    saveFlowchart,
    loadFlowchart,
    clearCanvas,
  };
};
