import { getMyStories } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

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

  return { stories, loading: loading || authLoading, error, user };
};
