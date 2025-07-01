import { STORY_GENRES } from "@/lib/constants.js";
import { body } from "express-validator";

const PREFERRED_STORY_GENRES = [...STORY_GENRES, "any"];

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("displayName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Display name cannot exceed 50 characters"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password").exists().withMessage("Password is required"),
];

export const updateProfileValidator = [
  body("displayName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Display name cannot exceed 50 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
  body("preferences.theme")
    .optional()
    .isIn(["light", "dark", "auto"])
    .withMessage("Invalid theme"),
  body("preferences.storyGenre")
    .optional()
    .isIn(PREFERRED_STORY_GENRES)
    .withMessage("Invalid story genre"),
];

export const changePasswordValidator = [
  body("currentPassword").exists().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];
