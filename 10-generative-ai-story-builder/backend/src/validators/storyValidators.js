import { STORY_GENRES, STORY_TONES } from "@/lib/constants.js";
import { body, param } from "express-validator";

export const createStoryValidator = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("initialPrompt")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Initial prompt must be between 10 and 1000 characters"),
  body("genre").optional().isIn(STORY_GENRES).withMessage("Invalid genre"),
  body("tone").optional().isIn(STORY_TONES).withMessage("Invalid tone"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

export const getStoryValidator = [
  param("id").isMongoId().withMessage("Invalid story ID"),
];

export const completeStoryValidator = [
  param("id").isMongoId().withMessage("Invalid story ID"),
  body("makePublic")
    .optional()
    .isBoolean()
    .withMessage("makePublic must be boolean"),
];

export const updateStoryValidator = [
  param("id").isMongoId().withMessage("Invalid story ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("genre").optional().isIn(STORY_GENRES).withMessage("Invalid genre"),
  body("tone").optional().isIn(STORY_TONES).withMessage("Invalid tone"),
  body("status")
    .optional()
    .isIn(["draft", "in-progress", "completed", "abandoned"])
    .withMessage("Invalid status"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

export const addSegmentValidator = [
  param("id").isMongoId().withMessage("Invalid story ID"),
  body("content")
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Content must be between 50 and 2000 characters"),
  body("choices").optional().isArray().withMessage("Choices must be an array"),
  body("parentChoiceId")
    .optional()
    .isString()
    .withMessage("Parent choice ID must be a string"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  body("imagePrompt")
    .optional()
    .isString()
    .withMessage("Image prompt must be a string"),
];
