import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

import {
  addItemToCart,
  getCart,
  removeItemFromCart,
  editCartItem,
} from "../controllers/cart.controller"

const router = express.Router()

router.post("/:id", protect, addItemToCart)

router.get("/", protect, getCart)

router.delete("/:id", protect, removeItemFromCart)

router.patch("/:id", protect, editCartItem)

export default router
