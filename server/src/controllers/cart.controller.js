import prisma from "../config/db"

export const addItemToCart = async (req, res) => {
  try {
    const { id: productId } = req.params
    const { id: userId } = req.user

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      })
      return res.status(200).json(updatedItem)
    }

    const newItem = await prisma.cartItem.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        quantity: 1,
      },
    })
    return res.status(201).json(newItem)
  } catch (error) {
    console.error("failed to add item to the cart:", error.message)
    res.status(500).json({ message: "failed to add item to the cart" })
  }
}

export const getCart = async (req, res) => {
  try {
    const { id } = req.user

    const fetchedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
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
        },
      },
    })

    return res.status(201).json(fetchedUser.cartItems)
  } catch (error) {
    console.error("failed to fetch cart:", error.message)
    res.status(500).json({ message: "failed to fetch cart" })
  }
}

export const removeItemFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: "not authorized" })
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: { userId, productId },
    })

    if (deleted.count === 0) {
      return res.status(404).json({ message: "cart item not found" })
    }
    return res.status(200).json({ message: "item removed from cart" })
  } catch (error) {
    console.error("failed to remove item from the cart:", error.message)
    res.status(500).json({ message: "failed to remove item from the cart" })
  }
}

// will add other features to it later
export const editCartItem = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    // if new quantity is 0, removes the cart item entirely
    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id } })
      // returns 204 since there's no content after deletion
      return res.sendStatus(204)
    }

    // otherwise updates the item's quantity in cart
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    })

    return res.status(200).json(updatedItem)
  } catch (error) {
    console.error("failed to edit or delete cart item:", error.message)
    res.status(500).json({ message: "failed to edit or delete cart item" })
  }
}
