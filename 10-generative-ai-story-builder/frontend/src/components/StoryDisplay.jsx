import { motion } from "framer-motion";
import { BookOpen, Download, Loader2, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ChoicePanel from "./ChoicePanel";
import ImageDisplay from "./ImageDisplay";

const getProgressWidth = (step) => {
  if (!step) return "0%";
  if (step.includes("Creating")) return "20%";
  if (step.includes("Writing")) return "40%";
  if (step.includes("artwork")) return "60%";
  if (step.includes("choices")) return "80%";
  if (step.includes("Finalizing")) return "100%";
  return "0%";
};

const StoryDisplay = ({
  story,
  onMakeChoice,
  isGenerating,
  generationStep,
  currentSegment,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!story?.text) return;

    setDisplayedText("");
    setIsTyping(true);

    const text = story.text;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 1); // Super fast typing - 1ms per character

    return () => clearInterval(typeInterval);
  }, [story?.text]);

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Story Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Chapter {story.depth + 1}</h2>
              <p className="text-primary-100 text-sm">Interactive Story</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Story Image */}
      {story.image ? (
        <ImageDisplay src={story.image} alt="Story scene" />
      ) : isGenerating &&
        generationStep &&
        generationStep.includes("artwork") ? (
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span>Creating artwork...</span>
          </div>
        </div>
      ) : null}

      {/* Story Content */}
      <div className="p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed text-lg mb-6">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1 h-6 bg-primary-500 ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Choices */}
        {!isTyping &&
          !isGenerating &&
          story.choices &&
          story.choices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ChoicePanel
                choices={story.choices}
                onMakeChoice={onMakeChoice}
                disabled={isGenerating}
              />
            </motion.div>
          )}

        {/* Progressive Loading State */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <div className="flex items-center space-x-3 text-primary-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">
                {generationStep || "Generating next chapter..."}
              </span>
            </div>
            {/* Progress indicator */}
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: getProgressWidth(generationStep) }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Story End */}
        {!isTyping &&
          !isGenerating &&
          (!story.choices || story.choices.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center py-8"
            >
              <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-accent-800 mb-2">
                  The End
                </h3>
                <p className="text-accent-700">
                  This path of your story has reached its conclusion. Explore
                  other branches to discover new adventures!
                </p>
              </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};

export default StoryDisplay;
