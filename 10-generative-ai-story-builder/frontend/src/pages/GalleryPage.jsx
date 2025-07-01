import AuthContext from "@/contexts/AuthContext";
import { getMyStories } from "@/utils/api";
import { motion } from "framer-motion";
import { BookOpen, Eye, PlusSquare, Share2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GalleryPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchStories = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyStories();
        setStories(response.data.data.stories);
        setError(null);
      } catch (err) {
        setError("Failed to fetch your stories. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            View Your Story Gallery
          </h2>
          <p className="text-gray-600 mb-8">
            Please log in to see the stories you've created.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">My Stories</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of all the interactive adventures you have crafted.
          </p>
        </motion.div>

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Story Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 flex-1 pr-2">
                      {story.title}
                    </h3>
                    <span
                      className={`capitalize text-xs font-medium px-2.5 py-1 rounded-full ${
                        story.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {story.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {story.description}
                  </p>

                  {/* Story Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{story.stats?.totalSegments || 0} segments</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{story.stats?.views || 0}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium capitalize px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {story.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={
                        story.status === "completed"
                          ? `/story/${story._id}`
                          : `/create/${story._id}`
                      }
                      className="flex-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                          story.status === "completed"
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg"
                            : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg"
                        }`}
                      >
                        {story.status === "completed"
                          ? "View Story"
                          : "Continue Building"}
                      </motion.button>
                    </Link>
                    {story.status === "completed" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/story/${story._id}`;
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            // You could add a toast notification here
                            alert("Story link copied to clipboard!");
                          });
                        }}
                        className="p-2 border border-gray-300 rounded-lg hover:border-green-400 hover:text-green-600 transition-all duration-200"
                        title="Copy shareable link"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    {story.status !== "completed" && (
                      <div
                        className="p-2 border border-gray-200 rounded-lg text-gray-400"
                        title="Complete story to share"
                      >
                        <Share2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No stories yet!
            </h3>
            <p className="text-gray-600 mb-6">
              It looks like you haven't created any stories. Let's change that!
            </p>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center mx-auto"
              >
                <PlusSquare className="w-5 h-5 mr-2" />
                Create Your First Story
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
