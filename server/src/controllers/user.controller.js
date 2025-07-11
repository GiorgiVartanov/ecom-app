import prisma from "../config/db"

// gets single user
// PROTECTED [USER]
export const getUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "user id is required" })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        wishlist: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
        reviews: {
          select: {
            id: true,
            score: true,
            text: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "product not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("user fetch error:", error)
    res.status(500).json({ error: "failed to fetch user" })
  }
}

// edits user profile
// PROTECTED [USER]
export const editProfile = async (req, res) => {}

// disables user account
// PROTECTED [USER]
export const disableAccount = async (req, res) => {}
