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
          orderBy: [{ key: "asc" }, { value: "asc" }],
        },
        images: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            imageURL: true,
            position: true,
          },
        },
        sale: true,
      },
    })

    if (!product) {
      return res.status(404).json({ error: "product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error("product fetch error:", error)
    res.status(500).json({ error: "failed to fetch product" })
  }
}

export const getProducts = async (req, res) => {
  try {
    const { query, sale, priceFrom, priceTo, minScore, sortBy, limit, page } = req.query

    const where = {}

    // filters tags (category, brand, etc)
    const reserved = [
      "query",
      "sale",
      "priceFrom",
      "priceTo",
      "minScore",
      "sortBy",
      "limit",
      "page",
    ]
    const dynamicTagFilters = Object.entries(req.query)
      .filter(([key]) => !reserved.includes(key))
      .map(([key, value]) => ({
        tags: {
          some: {
            key,
            value: String(value),
          },
        },
      }))

    if (dynamicTagFilters.length) {
      where.AND = (where.AND || []).concat(dynamicTagFilters)
    }

    // filters by price
    if (priceFrom || priceTo) {
      where.price = {}
      if (priceFrom) where.price.gte = Number(priceFrom)
      if (priceTo) where.price.lte = Number(priceTo)
    }

    // filters by score
    if (minScore) {
      where.reviews = {
        some: {
          score: { gte: Number(minScore) },
        },
      }
    }

    // filters by sale presence
    if (sale) {
      where.sale = {
        isNot: null,
      }
    }

    // filters by search query
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { some: { key: { contains: query, mode: "insensitive" } } } },
        { tags: { some: { value: { contains: query, mode: "insensitive" } } } },
      ]
    }

    where.status = "ACTIVE"

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
        images: {
          where: { position: 0 },
          take: 1,
          select: {
            id: true,
            imageURL: true,
            position: true,
          },
        },
      },
      ...(sortBy && { orderBy: { [sortBy]: "asc" } }),
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
    const { name, description, price, stock = 0, tags = [], images = [] } = req.body

    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" })
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "price must be a positive number" })
    }

    if (isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        OR: tags.map((tag) => ({
          key: tag.key,
          value: tag.value,
        })),
      },
    })

    const existingMap = new Map(existingTags.map((tag) => [`${tag.key}:${tag.value}`, tag]))
    const newTags = tags.filter((tag) => !existingMap.has(`${tag.key}:${tag.value}`))

    const newTagData = newTags.map((tag) => ({
      key: tag.key,
      value: tag.value,
    }))

    await prisma.tag.createMany({
      data: newTagData,
      skipDuplicates: true, // in case of race conditions
    })

    const allTags = await prisma.tag.findMany({
      where: {
        OR: tags.map((tag) => ({ key: tag.key, value: tag.value })),
      },
    })

    // prepares create payload
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        tags: {
          connect: allTags.map((tag) => ({ id: tag.id })),
        },
      },
    })

    if (images?.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) => uploadImage(image.base64, "product", newProduct.id))
      )

      const imagesToSave = uploadedImages.map((image, index) => ({
        imageURL: image.secure_url,
        position: index,
        productId: newProduct.id,
      }))

      await prisma.productImage.createMany({ data: imagesToSave })
    }

    const fullProductData = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: { tags: true, images: true },
    })

    return res.status(201).json(fullProductData)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "failed to create product" })
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      price,
      stock,
      tags = [],
      deletedTagIds = [],
      images = [],
      deletedImageIds = [],
    } = req.body

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res.status(400).json({ message: "price must be a positive number" })
    }

    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    // fetches existing product with images and tags
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, tags: true },
    })

    if (!existingProduct) {
      return res.status(404).json({ message: "product not found" })
    }

    const newImages = []
    const oldImages = []

    // filters images as old and new
    images.forEach(async (image, index) => {
      // console.log(image)

      if (image?.url?.includes("https://") || image?.imageURL?.includes("https://")) {
        // oldImages.push({ url: image, position: index })
        oldImages.push({ ...image, position: index })
      } else {
        newImages.push({ ...image, position: index })
      }
    })

    // updates existing images
    if (oldImages?.length > 0) {
      // console.log(oldImages)

      oldImages.forEach(async (image) => {
        await prisma.productImage.update({
          where: { id: image.id },
          data: {
            position: image.position,
          },
        })
      })
    }

    // deletes images
    if (deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          id: {
            in: deletedImageIds,
          },
        },
      })
    }

    // adds new images
    if (newImages?.length > 0) {
      // console.log(newImages)

      const uploadedImages = await Promise.all(
        newImages.map((image) => uploadImage(image.base64, "product", id))
      )

      const images = uploadedImages.map((img, index) => ({
        imageURL: img.secure_url,
        position: newImages[index].position,
        productId: id,
      }))

      await prisma.productImage.createMany({ data: images })
    }

    // finds existing combination of each key value
    const existingTags = await prisma.tag.findMany({
      where: {
        OR: tags.map((tag) => ({
          key: tag.key,
          value: tag.value,
        })),
      },
    })

    const existingMap = new Map(existingTags.map((tag) => [`${tag.key}:${tag.value}`, tag]))
    const tagsToCreate = tags.filter((tag) => !existingMap.has(`${tag.key}:${tag.value}`))

    const createdNewTags = await Promise.all(
      tagsToCreate.map(({ key, value }) =>
        prisma.tag.create({
          data: { key, value },
        })
      )
    )

    const data = {
      tags: {},
    }

    if ([...existingTags, ...createdNewTags].length > 0) {
      data.tags.connect = [...existingTags, ...createdNewTags].map((tag) => ({ id: tag.id }))
    }

    console.log(deletedTagIds)

    if (deletedTagIds?.length > 0) {
      data.tags.disconnect = deletedTagIds.map((id) => ({ id }))
    }

    if (name) data.name = name
    if (description) data.description = description
    if (price !== undefined) data.price = Number(price)
    if (stock !== undefined) data.stock = Number(stock)

    console.log(data)
    console.dir(data, { depth: null })

    // update product record
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: { tags: true, images: true },
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
