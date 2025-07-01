import express from "express"
import { auth } from "../middleware/auth.js"
import { asyncHandler } from '../middleware/errorHandler.js'
import User from "../models/User.js"

const router = express.Router()

// Register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, displayName } = req.body

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      res.status(400)
      throw new Error(
        existingUser.email === email ? "Email already exists" : "Username already taken"
      )
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      displayName,
    })

    const token = user.getSignedJwtToken()

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    })
  })
)

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    // Generate token
    const token = user.getSignedJwtToken()

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    })
  })
)

// Get current user
router.get(
  "/me",
  auth,
  asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName,
        bio: req.user.bio,
        profileImage: req.user.profileImage,
        theme: req.user.theme,
      },
    })
  })
)

export default router
