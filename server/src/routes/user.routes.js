import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

import { getUser } from "../controllers/user.controller"

const router = express.Router()

// gets user
// PUBLIC
router.get("/:id", getUser)

export default router
