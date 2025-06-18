import express from "express"

import { optionalAuth, protect, protectAdmin } from "../middleware/authMiddleware"

import {
  getProduct,
  getProducts,
  writeReview,
  createProduct,
  editProduct,
  delistProduct,
} from "../controllers/products.controller"

const router = express.Router()

// Get single product
// PUBLIC
router.get("/:id", optionalAuth, getProduct)

// Get list of products
// PUBLIC
router.get("/", optionalAuth, getProducts)

// post a review
// PROTECTED [USER]
router.post("/:id/reviews", protect, writeReview)

// Add product
// PROTECTED [ADMIN]
router.post("/", protectAdmin, createProduct)

// Edit product
// PROTECTED [ADMIN]
router.patch("/:id", protectAdmin, editProduct)

// Delist product
// PROTECTED [ADMIN]
router.delete("/:id", protect, delistProduct)

export default router
