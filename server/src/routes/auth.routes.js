import express from "express"

import { register, login } from "../controllers/auth.controller"

const router = express.Router()

// registers user
// PUBLIC
router.post("/signup", register)

// logs in user
// PUBLIC
router.post("/signin", login)

export default router
