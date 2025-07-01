import { useStory } from "@/hooks/useStory";
import { motion } from "framer-motion";
import { Book, Calendar, User } from "lucide-react";
import { useParams } from "react-router-dom";

const StoryViewPage = () => {
  const { id } = useParams();
  const { story, storyPath, loading, error } = useStory(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Story Header */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {story.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{story.description}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{story.author.displayName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span className="capitalize">{story.genre}</span>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-10">
            {storyPath.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-900"
              >
                {segment.imageUrl && (
                  <img
                    src={segment.imageUrl}
                    alt="Story illustration"
                    className="rounded-xl shadow-lg mb-6 w-full object-cover"
                  />
                )}
                <p>{segment.content}</p>
                {index < storyPath.length - 1 && segment.choices.length > 0 && (
                  <div className="mt-6 not-prose p-4 border-l-4 border-primary-200 bg-primary-50">
                    <p className="font-semibold text-primary-800">
                      Choice made:{" "}
                      <span className="font-normal text-gray-700">
                        {segment.choices.find(
                          (c) => c.id === storyPath[index + 1].parentChoiceId
                        )?.text || "Continue..."}
                      </span>
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryViewPage;
