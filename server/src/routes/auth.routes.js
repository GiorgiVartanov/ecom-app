import express from "express"

import { register, login } from "../controllers/auth.controller"

const router = express.Router()

// Register a new user
router.post("/signup", register)

// Login an existing user
router.post("/signin", login)

export default router
