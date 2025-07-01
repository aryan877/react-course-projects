import { motion } from "framer-motion";
import { BookOpen, Circle } from "lucide-react";

const StoryTree = ({ storyTree, currentStoryId, onNavigateToNode }) => {
  // Build tree structure
  const buildTreeStructure = (nodes) => {
    const nodeMap = new Map();
    const roots = [];

    // Create node map
    nodes.forEach((node) => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build parent-child relationships
    nodes.forEach((node) => {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(nodeMap.get(node.id));
        }
      } else {
        roots.push(nodeMap.get(node.id));
      }
    });

    return roots;
  };

  const renderNode = (node, level = 0) => {
    const isActive = node.id === currentStoryId;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="mb-2">
        <motion.button
          onClick={() => onNavigateToNode(node.id)}
          className={`
            w-full text-left p-3 rounded-lg transition-all duration-200 border
            ${
              isActive
                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-lg"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-300"
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Circle
                className={`w-2 h-2 ${
                  isActive ? "fill-current" : "opacity-50"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">
                  Chapter {node.depth + 1}
                </span>
                <BookOpen className="w-3 h-3 opacity-70 flex-shrink-0" />
              </div>
              <p
                className={`text-xs line-clamp-2 ${
                  isActive ? "text-white/80" : "text-gray-500"
                }`}
              >
                {node.text?.substring(0, 80) || "Loading..."}...
              </p>
            </div>
          </div>
        </motion.button>

        {hasChildren && (
          <div className="mt-2">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeStructure = buildTreeStructure(storyTree);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Story Map</h3>
          <p className="text-sm text-gray-500">Navigate your story</p>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {treeStructure.map((rootNode) => renderNode(rootNode))}
      </div>

      {storyTree.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            <span className="font-medium">{storyTree.length}</span> chapters
            created
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StoryTree;
