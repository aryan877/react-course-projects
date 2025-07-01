import { motion } from "framer-motion";
import { Loader2, Wand2 } from "lucide-react";
import React, { useState } from "react";

const StoryInitializer = ({ onStartStory, isGenerating }) => {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("fantasy");
  const [tone, setTone] = useState("adventurous");

  const genres = [
    { value: "fantasy", label: "Fantasy" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "romance", label: "Romance" },
    { value: "horror", label: "Horror" },
    { value: "adventure", label: "Adventure" },
  ];

  const tones = [
    { value: "adventurous", label: "Adventurous" },
    { value: "mysterious", label: "Mysterious" },
    { value: "humorous", label: "Humorous" },
    { value: "dramatic", label: "Dramatic" },
    { value: "romantic", label: "Romantic" },
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "serious", label: "Serious" },
    { value: "whimsical", label: "Whimsical" },
  ];

  const examplePrompts = [
    "A detective discovers a hidden room in their apartment building",
    "An astronaut finds a mysterious artifact on Mars",
    "A librarian discovers books that can transport readers into their stories",
    "A chef's recipe accidentally opens a portal to another dimension",
    "A street artist's graffiti starts coming to life at night",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onStartStory(prompt.trim(), genre, tone);
    }
  };

  const useExamplePrompt = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Start Your Story
        </h2>
        <p className="text-gray-600 text-lg">
          Provide a compelling prompt and let AI create an interactive adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Story Prompt */}
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Story Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the beginning of your story..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            required
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {prompt.length}/500 characters
            </span>
          </div>
        </div>

        {/* Example Prompts */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Or try one of these examples:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => useExamplePrompt(example)}
                className="text-left p-3 bg-gray-50 hover:bg-primary-50 rounded-lg text-sm text-gray-700 hover:text-primary-700 transition-colors duration-200 border border-transparent hover:border-primary-200"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Genre and Tone Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
            >
              {genres.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
            >
              {tones.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Story...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Story</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default StoryInitializer;
