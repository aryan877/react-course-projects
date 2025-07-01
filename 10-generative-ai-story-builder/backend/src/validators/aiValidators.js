import { STORY_GENRES, STORY_TONES } from "@/lib/constants.js";
import { body } from "express-validator";

export const generateStoryValidator = [
  body("prompt").trim().notEmpty().withMessage("Prompt cannot be empty."),
  body("genre").optional().isIn(STORY_GENRES).withMessage("Invalid genre"),
  body("tone").optional().isIn(STORY_TONES).withMessage("Invalid tone"),
];

export const continueStoryValidator = [
  body("context").trim().notEmpty().withMessage("Context cannot be empty."),
  body("choice").trim().notEmpty().withMessage("Choice cannot be empty."),
];

export const generateChoicesValidator = [
  body("content").trim().notEmpty().withMessage("Content cannot be empty."),
];

export const generateImageValidator = [
  body("content").trim().notEmpty().withMessage("Content cannot be empty."),
];
