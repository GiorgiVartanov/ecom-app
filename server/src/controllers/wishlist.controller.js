import prisma from "../config/db"

// adds item to wishlist
// PROTECTED [USER]
export const addItemToWishlist = async (req, res) => {
  try {
    const { id: productId } = req.params
    const userId = req.user.id

    const alreadyWishlisted = await prisma.user.findFirst({
      where: {
        id: userId,
        wishlist: { some: { id: productId } },
      },
    })

    if (alreadyWishlisted) {
      return res.status(400).json({ error: "item already in wishlist" })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          connect: [{ id: productId }],
        },
      },
      include: { wishlist: true },
    })

    return res.status(200).json(updatedUser.wishlist)
  } catch (error) {
    console.error("Error adding item to wishlist:", error.message)
    return res.status(500).json({ error: "failed to add item to wishlist" })
  }
}

// removes item from wishlist
// PROTECTED [USER]
export const removeItemFromWishlist = async (req, res) => {
  try {
    const { id: productId } = req.params
    const userId = req.user.id

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          disconnect: [{ id: productId }],
        },
      },
      include: { wishlist: true },
    })

    return res.status(200).json(updatedUser.wishlist)
  } catch (error) {
    console.error("Error removing item from wishlist:", error.message)
    return res.status(500).json({ error: "failed to remove item from wishlist" })
  }
}

// gets user's wishlist
// PROTECTED [USER]
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id

    const userWithWishlist = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: true },
      include: {
        wishlist: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            images: {
              where: { position: 0 },
              select: { imageURL: true },
              take: 1,
            },
          },
        },
      },
    })

    if (!userWithWishlist) {
      return res.status(404).json({ error: "user not found" })
    }

    return res.status(200).json(userWithWishlist.wishlist)
  } catch (error) {
    console.error("Error fetching wishlist:", error.message)
    return res.status(500).json({ error: "failed to fetch wishlist" })
  }
}
