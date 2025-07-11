import prisma from "../config/db"

// creates order
// PROTECTED [USER]
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id

    const { order } = req.body

    if (!userId || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: "invalid payload" })
    }

    const productList = await Promise.all(
      order.map(async ({ productId, quantity }) => {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })

        if (!product) return null

        return {
          productId: productId,
          quantity,
          price: product.price,
        }
      })
    )

    if (productList.length === 0) {
      return res.status(400).json({ error: "No valid products in order" })
    }

    const totalPrice = productList.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder = await prisma.order.create({
      data: {
        userId,
        total: totalPrice,
        orderItems: {
          create: productList,
        },
      },
      include: {
        orderItems: true,
      },
    })

    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    res.status(201).json({ message: "Order created successfully", data: newOrder })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
}

// gets single order
// PROTECTED [USER]
export const getOrder = async (req, res) => {
  const { orderId } = req.params

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ error: "Failed to fetch order" })
  }
}

// gets list of orders for authenticated user
// PROTECTED [USER]
export const getOrderList = async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    })

    res.status(200).json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
}

// gets list of orders for specific user
// PROTECTED [ADMIN]
export const getUserOrderList = async (req, res) => {
  const { userId } = req.params

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
      },
    })

    res.status(200).json(orders)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    res.status(500).json({ error: "Failed to fetch user orders" })
  }
}

// gets list of all orders
// PROTECTED [ADMIN]
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.status(200).json(orders)
  } catch (error) {
    console.error("Error fetching all orders:", error)
    res.status(500).json({ error: "Failed to fetch all orders" })
  }
}

// edits order status
// PROTECTED [ADMIN]
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  const availableStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"]

  // console.log("status:", status, "orderId:", orderId)

  try {
    if (!availableStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    res.status(200).json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(500).json({ error: "Failed to update order status" })
  }
}
