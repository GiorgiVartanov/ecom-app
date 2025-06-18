import jwt from "jsonwebtoken"
import prisma from "../config/db"

export const optionalAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      })

      if (user) {
        req.user = user
      }
    } catch (error) {
      // invalid token, skip attaching user
      // console.error("optionalAuth:", error)
    }
  }

  next()
}

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // gets token from the header
      token = req.headers.authorization.split(" ")[1]

      // verifies token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // gets user from db using passed token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      })

      if (!user) {
        return res.status(401).json({ message: "not authorized, user not found" })
      }

      req.user = user
      return next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({ message: "not authorized" })
    }
  }

  return res.status(401).json({ message: "not authorized, no token" })
}

export const protectAdmin = async (req, res, next) => {
  await protect(req, res, async () => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "forbidden, admin only" })
    }
    next()
  })
}
