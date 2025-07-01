import { auth } from "@/middleware/auth.js";
import { asyncHandler } from "@/middleware/errorHandler.js";
import {
  continueStory,
  generateChoices,
  generateStoryImage,
  generateStoryOpening,
  isOpenAIConfigured,
} from "@/utils/openai.js";
import {
  continueStoryValidator,
  generateChoicesValidator,
  generateImageValidator,
  generateStoryValidator,
} from "@/validators/aiValidators.js";
import express from "express";
import { validationResult } from "express-validator";

const router = express.Router();

// Generate initial story from prompt
router.post(
  "/generate-story",
  [auth, ...generateStoryValidator],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { prompt, genre, tone } = req.body;

    // Check if AI is configured
    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI service is not available. Please contact support.",
      });
    }

    try {
      // Generate story opening
      const result = await generateStoryOpening(prompt, genre, tone);

      res.json({
        success: true,
        data: {
          content: result.content,
          metadata: result.metadata,
        },
      });
    } catch (error) {
      console.error("Story generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate story. Please try again.",
      });
    }
  })
);

// Continue story based on choice
router.post(
  "/continue-story",
  [auth, ...continueStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { context, choice } = req.body;

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI service is not available.",
      });
    }

    try {
      const result = await continueStory(context, choice);

      res.json({
        success: true,
        data: {
          content: result.content,
          metadata: result.metadata,
        },
      });
    } catch (error) {
      console.error("Story continuation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to continue story. Please try again.",
      });
    }
  })
);

// Generate choices for current story segment
router.post(
  "/generate-choices",
  [auth, ...generateChoicesValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { content } = req.body;

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI service is not available.",
      });
    }

    try {
      const result = await generateChoices(content);

      res.json({
        success: true,
        data: {
          choices: result.choices,
          metadata: result.metadata,
        },
      });
    } catch (error) {
      console.error("Choices generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate choices. Please try again.",
      });
    }
  })
);

// Generate image for story segment
router.post(
  "/generate-image",
  [auth, ...generateImageValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { content } = req.body;

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI service is not available.",
      });
    }

    if (process.env.ENABLE_IMAGE_GENERATION !== "true") {
      return res.status(503).json({
        success: false,
        error: "Image generation is currently disabled.",
      });
    }

    try {
      const result = await generateStoryImage(content);

      if (result.success) {
        res.json({
          success: true,
          data: {
            imageUrl: result.imageUrl,
            imagePrompt: result.imagePrompt,
            metadata: result.metadata,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || "Failed to generate image",
        });
      }
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate image. Please try again.",
      });
    }
  })
);

export default router;
