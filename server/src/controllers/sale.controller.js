import prisma from "../config/db"

// starts sale
// PROTECTED [ADMIN]
export const startSale = async (req, res) => {
  try {
    const { productIds, discount } = req.body

    if (!productIds || !discount) {
      return res.status(400).json({ error: "productIds and discount are required" })
    }

    const sale = await prisma.sale.create({
      data: {
        discount: discount,
        products: {
          updateMany: productIds.map((id) => ({
            where: { id },
            data: { saleId: undefined },
          })),
        },
      },
    })

    res.status(201).json(sale)
  } catch (error) {
    console.error("start sale error:", error)
    res.status(500).json({ error: "failed to start sale" })
  }
}

// ends sale
// PROTECTED [ADMIN]
export const endSale = async (req, res) => {
  try {
    const { saleId } = req.params

    if (!saleId) {
      return res.status(400).json({ error: "sale id is required" })
    }

    await prisma.product.updateMany({
      where: { saleId },
      data: { saleId: null },
    })

    const sale = await prisma.sale.update({
      where: { id: saleId },
    })

    res.status(200).json({ message: "sale ended successfully", sale })
  } catch (error) {
    console.error("end sale error:", error)
    res.status(500).json({ error: "failed to end sale" })
  }
}
