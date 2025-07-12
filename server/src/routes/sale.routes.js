import express from "express"

import { protectAdmin } from "../middleware/authMiddleware"

import { startSale, endSale } from "../controllers/sale.controller"

const router = express.Router()

// starts sale
// PROTECTED [ADMIN]
router.put("/sale/start", protectAdmin, startSale)

// ends sale
// PROTECTED [ADMIN]
router.put("/sale/end", protectAdmin, endSale)

export default router
