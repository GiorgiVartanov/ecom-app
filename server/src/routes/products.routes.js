import express from "express"

import { optionalAuth, protect, protectAdmin } from "../middleware/authMiddleware"

import {
  getProduct,
  getProducts,
  writeReview,
  deleteReview,
  createProduct,
  editProduct,
  delistProduct,
  getSearchTags,
} from "../controllers/products.controller"

const router = express.Router()

// gets search tags
// PUBLIC
router.get("/tags", getSearchTags)

// gets single product
// PUBLIC
router.get("/:id", optionalAuth, getProduct)

// gets list of products
// PUBLIC
router.get("/", optionalAuth, getProducts)

// posts review // will need to change to put
// PROTECTED [USER]
router.post("/:id/reviews", protect, writeReview)

// deletes review
// PROTECTED [USER]
router.delete("/:id/reviews/:reviewId", protect, deleteReview)

// adds product
// PROTECTED [ADMIN]
router.post("/", protectAdmin, createProduct)

// edits product
// PROTECTED [ADMIN]
router.patch("/:id", protectAdmin, editProduct)

// deletes product
// PROTECTED [ADMIN]
router.delete("/:id", protect, delistProduct)

export default router
