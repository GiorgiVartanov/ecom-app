import express from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/auth.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import productRoutes from "./routes/products.routes"
import userRoutes from "./routes/user.routes"
import saleRoutes from "./routes/sale.routes"
import wishlistRoutes from "./routes/wishlist.routes"

const app = express()

// app.set("trust proxy", 1)

const PORT = process.env.PORT || 8000

// daily rate limiting configuration (400 requests per day per IP)
const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1500, // limits each ip to 1500 requests per day
  message: {
    error: "daily request limit exceeded, please try again tomorrow",
    retryAfter: "24 hours",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// rate limiting configuration (20-minute window)
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 15 minutes
  max: 150, // 150 requests per windowMs (15 minutes) time
  message: {
    error: "too many requests from this ip, please try again later",
    retryAfter: "20 minutes",
  },
  standardHeaders: true, // returns rate limit info in the `rateLimit-*` headers
  legacyHeaders: false, // disables the `x-rateLimit-*` headers
})

// stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 15 minutes
  max: 25, // 15 auth requests per windowMs time
  message: {
    error: "too many authentication attempts, please try again later",
    retryAfter: "20 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors())

// daily rate limiting first (400 requests per day per IP)
// app.use(dailyLimiter)

// 15-minute rate limiting to all routes
// app.use(limiter)

// middleware
app.use(express.json({ limit: "15mb" }))
app.use(express.urlencoded({ extended: true, limit: "15mb" }))

// routes
app.use("/api/auth", authLimiter, authRoutes) // stricter rate limiting for auth
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/products", productRoutes)
app.use("/api/user", userRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/sale", saleRoutes)

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "server is running" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => console.log("server is running on port 8000"))
