import { getStory } from "@/utils/api";
import { useEffect, useState } from "react";

export const useStory = (id) => {
  const [story, setStory] = useState(null);
  const [storyPath, setStoryPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getStory(id);
        setStory(res.data.data);
        setStoryPath(res.data.data.path || []);
      } catch (err) {
        setError(
          "Failed to load the story. It may be private or does not exist."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  return { story, storyPath, loading, error };
};
