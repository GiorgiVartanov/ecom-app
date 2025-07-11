import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

import {
  addItemToCart,
  getCart,
  removeItemFromCart,
  editCartItem,
} from "../controllers/cart.controller"

const router = express.Router()

// adds item to cart
// PROTECTED [USER]
router.post("/:id", protect, addItemToCart)

// gets cart
// PROTECTED [USER]
router.get("/", protect, getCart)

// removes item from cart
// PROTECTED [USER]
router.delete("/:id", protect, removeItemFromCart)

// edits cart item
// PROTECTED [USER]
router.patch("/:id", protect, editCartItem)

export default router
