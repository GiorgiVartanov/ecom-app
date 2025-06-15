import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import productRoutes from "./routes/products.routes"
import userRoutes from "./routes/user.routes"

const app = express()

const PORT = process.env.PORT || 8000

app.use(cors())

// middleware
app.use(express.json({ limit: "25mb" }))
app.use(express.urlencoded({ extended: true, limit: "25mb" }))

// routes
app.use("/api/auth", authRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/products", productRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "server is running" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => console.log("server is running on port 8000"))
