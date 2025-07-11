import express from "express"

import { protect, protectAdmin } from "../middleware/authMiddleware"

import {
  createOrder,
  getOrder,
  getOrderList,
  getUserOrderList,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js"

const router = express.Router()

// creates order
// PROTECTED [USER]
router.post("/", protect, createOrder)

// gets all orders
// PROTECTED [ADMIN]
router.get("/all", protectAdmin, getAllOrders)

// gets single order
// PROTECTED [USER]
router.get("/:orderId", protect, getOrder)

// gets list of orders
// PROTECTED [USER]
router.get("/", protect, getOrderList)

// gets user order list (admin)
// PROTECTED [ADMIN]
router.get("/:userId/admin", protectAdmin, getUserOrderList)

// edits order status
// PROTECTED [ADMIN]
router.patch("/:orderId", protectAdmin, updateOrderStatus)

export default router
