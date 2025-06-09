import express from "express"

import { protectAdmin } from "../middleware/authMiddleware"

import { startSale, endSale } from "../controllers/sale.controller"

const router = express.Router()

// Start sale
// PROTECTED [ADMIN]
router.post("/:id/sale/start", protectAdmin, startSale)

// End sale
// PROTECTED [ADMIN]
router.post("/:id/sale/end", protectAdmin, endSale)

export default router
