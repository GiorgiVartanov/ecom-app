import prisma from "../config/db"

import uploadImage from "../utils/uploadImage"

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "product id is required" })
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
            key: true,
            value: true,
          },
        },
        sale: true,
      },
    })

    if (!product) {
      return res.status(404).json({ error: "product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("product fetch error:", error)
    res.status(500).json({ error: "failed to fetch product" })
  }
}

export const getProducts = async (req, res) => {
  try {
    const { sale, priceFrom, priceTo, minScore, sortBy } = req.query

    const where = {}

    if (priceFrom || priceTo) {
      where.price = {}

      if (priceFrom) where.price.gte = Number(priceFrom)
      if (priceTo) where.price.lte = Number(priceTo)
    }

    if (minScore) {
      where.reviews = {
        some: {
          score: { gte: Number(minScore) },
        },
      }
    }

    if (sale !== undefined) {
      where.sale = {
        isNot: null,
        AND: [
          { sale: { startsAt: { lte: new Date() } } },
          { sale: { endsAt: { gte: new Date() } } },
        ],
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        sale: true,
        tags: {
          select: {
            id: true,
            key: true,
            value: true,
          },
        },
        reviews: false,
      },
    })

    res.json(products)
  } catch (error) {
    console.error("product fetch error:", error)
    res.status(500).json({ error: "failed to fetch products" })
  }
}

export const writeReview = async (req, res) => {}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock = 0, tagIds = [], images = [] } = req.body

    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" })
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "price must be a positive number" })
    }

    if (isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    // preparing create payload
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    })

    if (images?.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((img) => uploadImage(img, "product", newProduct.id))
      )

      const imageData = uploadedImages.map((img, index) => ({
        imageURL: img.secure_url,
        position: index,
        productId: newProduct.id,
      }))

      await prisma.productImage.createMany({ data: imageData })
    }

    return res.status(201).json(newProduct)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "failed to create product" })
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, stock, tagIds = [], images = [] } = req.body

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res.status(400).json({ message: "price must be a positive number" })
    }

    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    // fetching existing product with images and tags
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, tags: true },
    })

    if (!existingProduct) {
      return res.status(404).json({ message: "product not found" })
    }

    // prepare image update and create lists
    const existingIds = new existingProduct.images.map((img) => img.id)
    const updatedImagesPromises = []
    const imagesToCreate = []

    // categorize images by existing vs new
    images.forEach((image, index) => {
      if (image.id && existingIds.has(image.id)) {
        // scheduling position update for existing image
        updatedImagesPromises.push(
          prisma.productImage.update({
            where: { id: image.id },
            data: { position: image.position ?? index },
          })
        )
      } else {
        // queueing new image for upload/create
        imagesToCreate.push({ file: image, position: image.position ?? index })
      }
    })

    await Promise.all(updatedImagesPromises)

    // uploads all new images and saves them to db
    if (imagesToCreate.length) {
      const uploads = await Promise.all(
        imagesToCreate.map(({ file }) => uploadImage(file, "product", id))
      )

      const createData = uploads.map((image, index) => ({
        imageURL: image.secure_url,
        position: imagesToCreate[index].position,
        productId: id,
      }))

      await prisma.productImage.createMany({ data: createData })
    }

    // update payload
    const data = {}
    if (name) data.name = name
    if (description) data.description = description
    if (price !== undefined) data.price = Number(price)
    if (stock !== undefined) data.stock = Number(stock)

    // add new tags
    data.tags = {
      set: tagIds.map((tagId) => ({ id: tagId })),
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: { tags: true },
    })

    return res.status(200).json(updatedProduct)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "failed to update product" })
  }
}

export const delistProduct = async (req, res) => {
  try {
    const { id } = req.params

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status: "DELISTED" },
    })

    res.status(200).json({ message: "product delisted", product: updatedProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "failed to delist product" })
  }
}
