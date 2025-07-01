import express from 'express'
import { auth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import Link from '../models/Link.js'

const router = express.Router()

// Get user's links
router.get(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const links = await Link.find({ user: req.user._id }).sort({ order: 1 })
    res.json({ links })
  })
)

// Create link
router.post(
  '/',
  auth,
  asyncHandler(async (req, res) => {
    const { title, url, description } = req.body

    const linkCount = await Link.countDocuments({ user: req.user._id })

    const link = new Link({
      user: req.user._id,
      title,
      url,
      description,
      order: linkCount,
    })

    await link.save()
    res.status(201).json({ link })
  })
)

// Update link
router.put(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const { title, url, description, isActive } = req.body

    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, url, description, isActive },
      { new: true }
    )

    if (!link) {
      res.status(404)
      throw new Error('Link not found')
    }

    res.json({ link })
  })
)

// Delete link
router.delete(
  '/:id',
  auth,
  asyncHandler(async (req, res) => {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!link) {
      res.status(404)
      throw new Error('Link not found')
    }

    res.json({ message: 'Link deleted successfully' })
  })
)

// Track click
router.post(
  '/:id/click',
  asyncHandler(async (req, res) => {
    await Link.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } })
    res.json({ message: 'Click tracked' })
  })
)

export default router
