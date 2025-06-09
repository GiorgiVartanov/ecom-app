import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

const router = express.Router()

export default router
