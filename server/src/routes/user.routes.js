import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

import { getUser } from "../controllers/user.controller"

const router = express.Router()

// Get user
router.get("/:id", getUser)

export default router
