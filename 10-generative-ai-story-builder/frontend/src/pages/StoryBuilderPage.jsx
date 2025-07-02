import StoryDisplay from "@/components/StoryDisplay";
import StoryInitializer from "@/components/StoryInitializer";
import StoryTree from "@/components/StoryTree";
import { useStoryBuilder } from "@/hooks/useStoryBuilder";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const StoryBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    storyData,
    currentStory,
    storyTree,
    isGenerating,
    generationStep,
    currentStorySegment,
    isLoading,
    error,
    isCompleting,
    handleStartStory,
    handleMakeChoice,
    handleCompleteStory,
    handleNavigateToNode,
    setError,
    storyId,
  } = useStoryBuilder(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Story Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Create your interactive story adventure
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg"
            role="alert"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Something went wrong
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                  onClick={() => setError(null)}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Story Completion Actions */}
        {storyData &&
          storyData.status !== "completed" &&
          storyTree.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 mb-6 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to complete your story?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your story has {storyTree.length} segments. You can mark it
                    as complete and optionally share it publicly.
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCompleteStory(false)}
                    disabled={isCompleting}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isCompleting ? "Completing..." : "Complete"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCompleteStory(true)}
                    disabled={isCompleting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4" />
                    {isCompleting ? "Publishing..." : "Complete & Publish"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        {/* Story Completed Status */}
        {storyData && storyData.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 mb-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Story Completed! 🎉
                  </h3>
                  <p className="text-gray-600 text-sm">
                    This story is{" "}
                    {storyData.isPublic
                      ? "published and publicly viewable"
                      : "completed but private"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {storyData.isPublic && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/story/${storyId}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View Public Story
                  </motion.button>
                )}
                {!storyData.isPublic && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCompleteStory(true)}
                    disabled={isCompleting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4" />
                    {isCompleting ? "Publishing..." : "Publish Story"}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Story Area */}
          <div className="lg:col-span-2">
            {!currentStory ? (
              <StoryInitializer
                onStartStory={handleStartStory}
                isGenerating={isGenerating}
              />
            ) : (
              <StoryDisplay
                story={currentStory}
                onMakeChoice={handleMakeChoice}
                isGenerating={isGenerating}
                generationStep={generationStep}
                currentSegment={currentStorySegment}
              />
            )}
          </div>

          {/* Story Tree Sidebar */}
          <div className="lg:col-span-1">
            {storyTree.length > 0 && (
              <StoryTree
                storyTree={storyTree}
                currentStoryId={currentStory?.id}
                onNavigateToNode={handleNavigateToNode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryBuilderPage;
