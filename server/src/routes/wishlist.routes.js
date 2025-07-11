import express from "express"

import { protect } from "../middleware/authMiddleware"

import {
  addItemToWishlist,
  removeItemFromWishlist,
  getWishlist,
} from "../controllers/wishlist.controller"

const router = express.Router()

// adds item to wishlist
// PROTECTED [USER]
router.post("/:id", protect, addItemToWishlist)

// removes item from wishlist
// PROTECTED [USER]
router.delete("/:id", protect, removeItemFromWishlist)

// gets wishlist
// PROTECTED [USER]
router.get("/", protect, getWishlist)

export default router
