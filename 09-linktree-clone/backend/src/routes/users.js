import express from 'express'
import { auth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import Link from '../models/Link.js'
import User from '../models/User.js'

const router = express.Router()

// Get public profile
router.get(
  '/:username',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).select('-password -email')
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const links = await Link.find({ user: user._id, isActive: true }).sort({ order: 1 })

    res.json({
      user: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        theme: user.theme,
      },
      links,
    })
  })
)

// Update profile
router.put(
  '/profile',
  auth,
  asyncHandler(async (req, res) => {
    const { displayName, bio, theme } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { displayName, bio, theme },
      { new: true }
    ).select('-password')

    res.json({ user })
  })
)

export default router
