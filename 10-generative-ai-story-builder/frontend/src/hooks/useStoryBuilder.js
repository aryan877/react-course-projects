import {
  addStorySegment,
  completeStory,
  continueStory,
  createStory,
  generateChoices,
  generateImage,
  generateStory,
  getStoryForEdit,
} from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useStoryBuilder = (id) => {
  const [storyId, setStoryId] = useState(id || null);
  const [storyData, setStoryData] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [storyTree, setStoryTree] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [currentStorySegment, setCurrentStorySegment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialStory = async () => {
      if (authLoading) return;
      if (!user) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        if (id) {
          const res = await getStoryForEdit(id);
          const storyToLoad = res.data.data;

          setStoryId(storyToLoad._id);
          setStoryData(storyToLoad);

          const storyNodes = storyToLoad.segments.map((segment) => ({
            id: segment.id,
            text: segment.content,
            image: segment.imageUrl,
            choices: segment.choices,
            parentId: segment.parentChoiceId,
            depth: segment.depth,
          }));
          setStoryTree(storyNodes);

          const current =
            storyNodes.find((n) => n.id === storyToLoad.currentSegmentId) ||
            storyNodes[storyNodes.length - 1];
          setCurrentStory(current);
        }
      } catch (err) {
        console.error("Failed to load story:", err);
        setError(
          "Failed to load story. It may not exist or you might not have permission to edit it."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialStory();
  }, [id, user, navigate, authLoading]);

  const handleStartStory = useCallback(
    async (prompt, genre, tone) => {
      if (!user) {
        setError("Please log in to create a story.");
        navigate("/login");
        return;
      }

      setIsGenerating(true);
      setError(null);
      setCurrentStorySegment(null);

      try {
        setGenerationStep("Creating your story...");
        const storyRes = await createStory({
          title: `${prompt.substring(0, 20)}...`,
          description: `A story about ${prompt.substring(0, 50)}...`,
          initialPrompt: prompt,
          genre,
          tone,
          isPublic: false,
        });
        const newStoryId = storyRes.data.data._id;
        setStoryId(newStoryId);

        setGenerationStep("Writing your story...");
        const contentRes = await generateStory(prompt, genre, tone);
        const content = contentRes.data.data.content;

        const partialNode = {
          id: `temp-${Date.now()}`,
          text: content,
          image: null,
          choices: [],
          parentId: null,
          depth: 0,
        };
        setCurrentStorySegment(partialNode);
        setCurrentStory(partialNode);

        setGenerationStep("Creating artwork...");
        const imageRes = await generateImage(content);
        const imageUrl = imageRes.data.data.imageUrl;

        const nodeWithImage = { ...partialNode, image: imageUrl };
        setCurrentStorySegment(nodeWithImage);
        setCurrentStory(nodeWithImage);

        setGenerationStep("Preparing your choices...");
        const choicesRes = await generateChoices(content);
        const choices = choicesRes.data.data.choices;

        setGenerationStep("Finalizing...");
        const segmentRes = await addStorySegment(newStoryId, {
          content,
          choices: choices.map((c) => c.text),
          imageUrl,
          imagePrompt: content.substring(0, 150),
          depth: 0,
        });
        const newSegment = segmentRes.data.data.segment;

        const finalNode = {
          id: newSegment.id,
          text: newSegment.content,
          image: newSegment.imageUrl,
          choices: newSegment.choices,
          parentId: null,
          depth: 0,
        };

        setCurrentStory(finalNode);
        setStoryTree([finalNode]);
        setCurrentStorySegment(null);

        navigate(`/create/${newStoryId}`, { replace: true });
      } catch (err) {
        console.error("Error generating story:", err);
        setError(
          err.response?.data?.error ||
            "Failed to start story. The AI service might be down."
        );
      } finally {
        setIsGenerating(false);
        setGenerationStep("");
      }
    },
    [user, navigate]
  );

  const handleMakeChoice = useCallback(
    async (choice) => {
      if (!currentStory || !storyId) return;

      setIsGenerating(true);
      setError(null);
      setCurrentStorySegment(null);

      const choiceText = typeof choice === "string" ? choice : choice.text;
      const context = `Previous story: ${currentStory.text}\nChosen path: ${choiceText}`;

      try {
        setGenerationStep("Continuing your story...");
        const storyRes = await continueStory(context, choiceText);
        const content = storyRes.data.data.content;

        const partialNode = {
          id: `temp-${Date.now()}`,
          text: content,
          image: null,
          choices: [],
          parentId: currentStory.id,
          depth: currentStory.depth + 1,
        };
        setCurrentStorySegment(partialNode);
        setStoryTree((prev) => [...prev, partialNode]);
        setCurrentStory(partialNode);

        setGenerationStep("Creating artwork...");
        const imageRes = await generateImage(content);
        const imageUrl = imageRes.data.data.imageUrl;

        const nodeWithImage = { ...partialNode, image: imageUrl };
        setCurrentStorySegment(nodeWithImage);
        setStoryTree((prev) =>
          prev.map((n) => (n.id === partialNode.id ? nodeWithImage : n))
        );
        setCurrentStory(nodeWithImage);

        setGenerationStep("Preparing your choices...");
        const choicesRes = await generateChoices(content);
        const newChoices = choicesRes.data.data.choices;

        setGenerationStep("Finalizing...");
        const segmentRes = await addStorySegment(storyId, {
          content,
          choices: newChoices.map((c) => c.text),
          imageUrl,
          imagePrompt: content.substring(0, 150),
          parentChoiceId: choice.id,
          depth: currentStory.depth + 1,
        });
        const newSegment = segmentRes.data.data.segment;

        const finalNode = {
          id: newSegment.id,
          text: newSegment.content,
          image: newSegment.imageUrl,
          choices: newSegment.choices,
          parentId: currentStory.id,
          depth: currentStory.depth + 1,
        };

        setStoryTree((prev) =>
          prev.map((n) => (n.id === partialNode.id ? finalNode : n))
        );
        setCurrentStory(finalNode);
        setCurrentStorySegment(null);
      } catch (err) {
        console.error("Error continuing story:", err);
        setError(err.response?.data?.error || "Failed to continue story.");
        // Clean up failed node
        setStoryTree((prev) => prev.filter((n) => !n.id.startsWith("temp-")));
        setCurrentStory(storyTree.find((n) => n.id === currentStory.id));
      } finally {
        setIsGenerating(false);
        setGenerationStep("");
      }
    },
    [currentStory, storyId, storyTree]
  );

  const handleCompleteStory = useCallback(
    async (makePublic = false) => {
      if (!storyId) return;

      setIsCompleting(true);
      try {
        await completeStory(storyId, makePublic);
        setStoryData((prev) => ({
          ...prev,
          status: "completed",
          isPublic: makePublic,
        }));
        if (makePublic) {
          navigate(`/story/${storyId}`);
        }
      } catch (err) {
        console.error("Failed to complete story:", err);
        setError(err.response?.data?.error || "Failed to complete story");
      } finally {
        setIsCompleting(false);
      }
    },
    [storyId, navigate]
  );

  const handleNavigateToNode = useCallback(
    (nodeId) => {
      const node = storyTree.find((n) => n.id === nodeId);
      if (node) {
        setCurrentStory(node);
      }
    },
    [storyTree]
  );

  return {
    storyId,
    storyData,
    currentStory,
    storyTree,
    isGenerating,
    generationStep,
    currentStorySegment,
    isLoading: isLoading || authLoading,
    error,
    isCompleting,
    user,
    handleStartStory,
    handleMakeChoice,
    handleCompleteStory,
    handleNavigateToNode,
    setError,
    navigate,
  };
};
