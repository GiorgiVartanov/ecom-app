import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import prisma from "../config/db"

const JWT_SECRET = process.env.JWT_SECRET

import { signUpSchema, signInSchema } from "../zod-schemas/auth.schemas"

// generates jwt token
function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET) // add expiresIn and logic for refreshToken latter
}

// registers user
// PUBLIC
export const register = async (req, res) => {
  try {
    const result = signUpSchema.safeParse(req.body)

    if (!result.success) {
      console.error("Validation error:", result.error)
      return res.status(400).json({
        error: "Validation failed",
        details: result.error,
      })
    }

    const { email, password, name } = req.body

    // checks if email is already in use
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(409).json({ error: "account with this email already exists" })
    }

    // hashes password
    const hashedPassword = await bcrypt.hash(password, 10)

    // creates user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    const token = generateToken(user)

    const userToSend = {
      id: user.id,
      email: user.email,
      name: user.name,
      icon: user.icon,
      role: user.role,
      orders: user.orders,
      wishList: user.wishlist,
      cartItems: user.cartItems,
      reviews: user.reviews,
    }

    res.status(201).json({ token, user: userToSend, message: "successfully registered" })
  } catch (error) {
    console.error("registration error:", error)
    res.status(500).json({ error: "failed to register user" })
  }
}

// logs in user
// PUBLIC
export const login = async (req, res) => {
  try {
    const result = signInSchema.safeParse(req.body)

    if (!result.success) {
      // if validation fails, send error details
      console.error("Validation error:", result.error)
      return res.status(400).json({
        error: "Validation failed",
        details: result.error,
      })
    }

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" })
    }

    // finds user by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" })
    }

    // compares password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "invalid credentials" })
    }

    // checks if user was suspended
    if (user.isSuspended) {
      return res.status(403).json({ error: "account is suspended" })
    }

    const token = generateToken(user)

    const userToSend = {
      id: user.id,
      email: user.email,
      name: user.name,
      icon: user.icon,
      role: user.role,
      orders: user.orders,
      wishList: user.wishlist,
      cartItems: user.cartItems,
      reviews: user.reviews,
    }

    if (user.role === "ADMIN") {
      // fetches tag keys with their tags (values)
      const tagKeys = await prisma.tagKey.findMany({
        include: {
          tags: {
            select: { value: true },
            distinct: ["value"],
          },
        },
      })

      // formats tags as array of { key, values }
      const tags = tagKeys
        .map((tagKey) => ({
          key: tagKey.name,
          id: tagKey.id,
          keyId: tagKey.keyId,
          isSearchable: tagKey.isSearchable,
          values: tagKey.tags.map((tag) => tag.value).sort((a, b) => a.localeCompare(b)),
        }))
        .sort((a, b) => a.key.localeCompare(b.key))

      res.status(201).json({ token, user: userToSend, tags, message: "successfully logged in" })
      return
    }

    res.status(201).json({ token, user: userToSend, message: "successfully logged in" })
  } catch (error) {
    console.error("login error:", error)
    res.status(500).json({ error: "failed to login" })
  }
}
