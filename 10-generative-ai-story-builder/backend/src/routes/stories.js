import { STORY_GENRES } from "@/lib/constants.js";
import { auth, authOptional } from "@/middleware/auth.js";
import { asyncHandler } from "@/middleware/errorHandler.js";
import Story from "@/models/Story.js";
import {
  addSegmentValidator,
  completeStoryValidator,
  createStoryValidator,
  getStoryValidator,
  updateStoryValidator,
} from "@/validators/storyValidators.js";
import express from "express";
import { validationResult } from "express-validator";

const router = express.Router();

// Get all stories for authenticated user
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      status,
      genre,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { author: req.user._id };

    if (
      status &&
      ["draft", "in-progress", "completed", "abandoned"].includes(status)
    ) {
      filter.status = status;
    }

    if (genre && STORY_GENRES.includes(genre)) {
      filter.genre = genre;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const stories = await Story.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-segments") // Don't include full segments in list view
      .exec();

    const total = await Story.countDocuments(filter);

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalStories: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  })
);

// Create new story
router.post(
  "/",
  [auth, ...createStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { title, description, initialPrompt, genre, tone, tags, isPublic } =
      req.body;

    const story = new Story({
      title,
      description,
      initialPrompt,
      genre: genre || "other",
      tone: tone || "adventurous",
      author: req.user._id,
      tags: tags || [],
      isPublic: isPublic || false,
    });

    await story.save();

    // Update user's story count
    req.user.stats.storiesCreated += 1;
    await req.user.save();

    const populatedStory = await Story.findById(story._id).populate(
      "author",
      "username displayName avatar"
    );

    res.status(201).json({
      success: true,
      data: populatedStory,
    });
  })
);

// Get specific story by ID (for public viewing)
router.get(
  "/:id",
  [authOptional, ...getStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Invalid story ID",
      });
    }

    const story = await Story.findById(req.params.id).populate(
      "author",
      "username displayName avatar"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    // For public viewing route, prioritize public completed stories
    // Allow author access regardless, but make it clear this is for viewing
    const isAuthor =
      req.user && story.author._id.toString() === req.user._id.toString();
    const isPublicCompleted = story.isPublic && story.status === "completed";

    if (!isPublicCompleted && !isAuthor) {
      return res.status(403).json({
        success: false,
        error: "This story is not publicly available",
      });
    }

    // Increment view count only for public stories viewed by others
    if (story.isPublic && !isAuthor) {
      story.stats.views += 1;
      await story.save();
    }

    const storyPath = story.getStoryPath();

    res.json({
      success: true,
      data: { ...story.toObject(), path: storyPath },
    });
  })
);

// Get specific story for editing (separate endpoint)
router.get(
  "/:id/edit",
  [auth, ...getStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Invalid story ID",
      });
    }

    const story = await Story.findById(req.params.id).populate(
      "author",
      "username displayName avatar"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    // Check if user can edit this story
    const canEdit =
      story.author._id.toString() === req.user._id.toString() ||
      story.collaboration.collaborators.some(
        (collab) =>
          collab.user.toString() === req.user._id.toString() &&
          collab.role === "editor"
      );

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    res.json({
      success: true,
      data: story,
    });
  })
);

// Complete and optionally publish story
router.post(
  "/:id/complete",
  [auth, ...completeStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    const canEdit = story.author.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    story.status = "completed";

    if (req.body.makePublic !== undefined) {
      story.isPublic = req.body.makePublic;
    }

    await story.save();

    res.json({
      success: true,
      data: story,
      message: story.isPublic
        ? "Story completed and published!"
        : "Story marked as completed!",
    });
  })
);

// Update story
router.put(
  "/:id",
  [auth, ...updateStoryValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    // Check if user owns the story or is a collaborator with edit permissions
    const canEdit =
      story.author.toString() === req.user._id.toString() ||
      story.collaboration.collaborators.some(
        (collab) =>
          collab.user.toString() === req.user._id.toString() &&
          collab.role === "editor"
      );

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const updateFields = [
      "title",
      "description",
      "genre",
      "tone",
      "status",
      "tags",
      "isPublic",
    ];
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        story[field] = req.body[field];
      }
    });

    await story.save();

    res.json({
      success: true,
      data: story,
    });
  })
);

// Add story segment
router.post(
  "/:id/segments",
  [auth, ...addSegmentValidator],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    const canEdit =
      story.author.toString() === req.user._id.toString() ||
      story.collaboration.collaborators.some(
        (collab) =>
          collab.user.toString() === req.user._id.toString() &&
          collab.role === "editor"
      );

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        error: "Permission denied",
      });
    }

    const {
      content,
      choices = [],
      parentChoiceId,
      imageUrl,
      imagePrompt,
      metadata,
      depth,
    } = req.body;

    const newSegment = story.addSegment({
      content,
      choices: choices.map((choice) => ({
        text: choice.text || choice,
        selected: false,
      })),
      parentChoiceId,
      imageUrl,
      imagePrompt,
      metadata: metadata || {},
      depth,
    });

    // Update story status
    if (story.status === "draft") {
      story.status = "in-progress";
    }

    await story.save();

    res.status(201).json({
      success: true,
      data: {
        segment: newSegment,
        story: {
          id: story._id,
          currentSegmentId: story.currentSegmentId,
          status: story.status,
          stats: story.stats,
        },
      },
    });
  })
);

export default router;
