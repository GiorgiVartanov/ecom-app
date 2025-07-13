// gets single product
// PUBLIC
import prisma from "../config/db"

import uploadImage from "../utils/uploadImage"

import { productSchema } from "../zod-schemas/product.schemas"
import { reviewSchema } from "../zod-schemas/review.schemas"

// fetches product by id and includes related data
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // returns bad request if no id
    if (!id) {
      return res.status(400).json({ error: "product id is required" })
    }

    // fetches product with related data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        tags: {
          orderBy: [{ tagKey: { name: "asc" } }, { value: "asc" }],
          select: {
            id: true,
            value: true,
            tagKey: { select: { name: true, isSearchable: true } },
          },
        },
        images: {
          orderBy: { position: "asc" },
          select: { id: true, imageURL: true, position: true },
        },
        sale: true,
      },
    })

    // returns not found if product does not exist
    if (!product) {
      return res.status(404).json({ error: "product not found" })
    }

    // checks if product is in user's cart
    let isInCart = false
    if (userId) {
      const cartItem = await prisma.cartItem.findFirst({
        where: { userId, productId: id },
      })
      isInCart = Boolean(cartItem)
    }

    // checks if product is wishlisted by user
    let isWishlisted = false
    if (userId) {
      const wishItem = await prisma.user.findFirst({
        where: {
          id: userId,
          wishlist: { some: { id } },
        },
      })
      isWishlisted = Boolean(wishItem)
    }

    // checks if user has purchased the product
    let hasPurchased = false
    if (userId) {
      const purchased = await prisma.orderItem.findFirst({
        where: {
          productId: id,
          order: { userId, status: "DELIVERED" },
        },
      })
      hasPurchased = Boolean(purchased)
    }

    // responds with product data and flags
    res.status(200).json({
      ...product,
      tags: product.tags.map((tag) => ({
        id: tag.id,
        key: tag.tagKey.name,
        value: tag.value,
        isSearchTag: tag.tagKey.isSearchable,
      })),
      isInCart,
      isWishlisted,
      hasPurchased,
    })
  } catch (error) {
    console.error("product fetch error:", error)
    res.status(500).json({ error: "failed to fetch product" })
  }
}

// gets list of products
// PUBLIC
export const getProducts = async (req, res) => {
  try {
    const {
      query,
      sale,
      priceFrom,
      priceTo,
      minScore,
      orderBy,
      limit = 20,
      page = 1,
      ...restFilters
    } = req.query
    const userId = req.user?.id

    const tagExceptions = [
      "query",
      "limit",
      "page",
      "sale",
      "priceFrom",
      "priceTo",
      "minScore",
      "orderBy",
    ]

    const orderFields = ["price", "name", "createdAt", "updatedAt"]
    const orderDirections = ["asc", "desc"]

    // parses orderBy parameter which comes as "field:direction" (e.g., "price:asc")

    let parsedOrderBy = "createdAt"
    let parsedOrderDirection = "desc"

    if (orderBy && typeof orderBy === "string") {
      if (orderBy === "default") {
        parsedOrderBy = "createdAt"
        parsedOrderDirection = "desc"
      } else {
        const [field, direction] = orderBy.split(":")
        if (orderFields.includes(field)) {
          parsedOrderBy = field
          parsedOrderDirection = orderDirections.includes(direction) ? direction : "asc"
        }
      }
    }

    // builds base where clause
    const where = { status: "ACTIVE" }

    // builds dynamic tag filters for any query params not reserved
    const dynamicTagFilters = Object.entries(restFilters)
      .filter(([key]) => !tagExceptions.includes(key))
      .map(([key, value]) => ({
        tags: {
          some: {
            tagKey: {
              name: key,
              isSearchable: true,
            },
            value: {
              equals: String(value),
              mode: "insensitive",
            },
          },
        },
      }))

    if (dynamicTagFilters.length) {
      where.AND = dynamicTagFilters
    }

    // filters by price range
    if ((priceFrom || priceTo) && !isNaN(priceFrom) && !isNaN(priceTo)) {
      where.price = {}
      if (priceFrom) where.price.gte = parseFloat(priceFrom)
      if (priceTo) where.price.lte = parseFloat(priceTo)
    }

    // filters by minimum review score
    if (minScore) {
      where.reviews = {
        some: { score: { gte: parseFloat(minScore) } },
      }
    }

    // filters by sale presence
    if (sale) {
      where.sale = { isNot: null }
    }

    // filters by search query across name, description, tags
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          tags: {
            some: {
              tagKey: { name: { contains: query, mode: "insensitive" } },
              value: { contains: query, mode: "insensitive" },
            },
          },
        },
      ]
    }

    const safeParseInt = (value, defaultValue) => {
      const parsed = parseInt(value, 10)
      return isNaN(parsed) || parsed < 1 ? defaultValue : parsed
    }

    // calculates pagination
    const take = safeParseInt(limit, 20)
    const currentPage = safeParseInt(page, 1)
    const skip = (currentPage - 1) * take

    // fetches products with related data
    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { [parsedOrderBy]: parsedOrderDirection },
      include: {
        sale: true,
        tags: {
          orderBy: [{ tagKey: { name: "asc" } }, { value: "asc" }],
          select: {
            id: true,
            value: true,
            tagKey: { select: { name: true, isSearchable: true } },
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
    })

    // computes which products are in cart
    let inCartIds = []
    if (userId) {
      const cartItems = await prisma.cartItem.findMany({
        where: {
          userId,
          productId: { in: products.map((product) => product.id) },
        },
        select: { productId: true },
      })
      inCartIds = cartItems.map((item) => item.productId)
    }

    // computes which products are wishlisted
    let wishlistedIds = []
    if (userId) {
      const userWithWishlist = await prisma.user.findUnique({
        where: { id: userId },
        select: { wishlist: { select: { id: true } } },
      })
      wishlistedIds = userWithWishlist?.wishlist.map((wish) => wish.id) || []
    }

    // fetches total count for pagination
    const totalCount = await prisma.product.count({ where })
    const totalPages = Math.ceil(totalCount / take)

    const productsToSend = products.map((product) => ({
      ...product,
      tags: product.tags.map((tag) => ({
        id: tag.id,
        key: tag.tagKey.name,
        value: tag.value,
        isSearchTag: tag.tagKey.isSearchable,
      })),
      isInCart: userId ? inCartIds.includes(product.id) : false,
      isWishlisted: userId ? wishlistedIds.includes(product.id) : false,
    }))

    // returns products with pagination info: current page, has next/previous, and total pages (overall)
    res.status(200).json({
      products: productsToSend,
      currentPage: Number(req.query.page) || 1,
      hasNextPage: (Number(req.query.page) || 1) < (totalPages || 1),
      hasPreviousPage: (Number(req.query.page) || 1) > 1,
      totalPages: totalPages || 1,
    })
  } catch (error) {
    console.error("products fetch error:", error)
    res.status(500).json({ error: "failed to fetch products" })
  }
}

// posts a review
// PROTECTED [USER]
export const writeReview = async (req, res) => {
  try {
    const result = reviewSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors })
    }

    const { id: productId } = req.params
    const { rating, comment, reviewId } = req.body
    const { id: userId } = req.user

    if (!userId) {
      return res.status(401).json({ error: "unauthorized" })
    }

    if (!productId) {
      return res.status(400).json({ error: "product id is required" })
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "rating must be between 0 and 5" })
    }

    // checks if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    })

    if (reviewId) {
      if (!existingReview) {
        return res.status(404).json({ error: "review not found" })
      }

      // updates the found review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          score: rating,
          text: comment,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      })

      return res.status(200).json(updatedReview)
    }

    // creates new review
    const newReview = await prisma.review.create({
      data: {
        score: rating,
        text: comment,
        productId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    res.status(201).json(newReview)
  } catch (error) {
    console.error("review submission error:", error)
    res.status(500).json({ error: "failed to submit review" })
  }
}

// deletes a review
// PROTECTED [USER]
export const deleteReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params
    const { id: userId } = req.user

    if (!userId) {
      return res.status(401).json({ error: "unauthorized" })
    }

    // const review = await prisma.review.findFirst({
    //   where: { id: reviewId, productId, userId },
    // })

    const review = await prisma.review.findFirst({
      where: { productId, userId },
    })

    if (!review) {
      return res.status(404).json({ error: "review not found" })
    }

    await prisma.review.delete({ where: { id: review.id } })

    res.status(200).json({ message: "review deleted" })
  } catch (error) {
    console.error("review deletion error:", error)
    res.status(500).json({ error: "failed to delete review" })
  }
}

// adds product
// PROTECTED [ADMIN]
export const createProduct = async (req, res) => {
  try {
    const result = productSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors })
    }

    const { name, description, price, stock = 0, tags = [], images = [] } = req.body

    // returns bad request if missing name or price
    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" })
    }

    // returns bad request if price is invalid
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "price must be a positive number" })
    }

    // returns bad request if stock is invalid
    if (isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    // fetches existing tag keys for provided tag names
    const keyNames = [...new Set(tags.map((tag) => tag.key))]
    const existingTagKeys = await prisma.tagKey.findMany({ where: { name: { in: keyNames } } })
    const existingKeyMap = new Map(existingTagKeys.map((key) => [key.name, key]))

    // creates missing tag keys
    const newKeyData = keyNames
      .filter((key) => !existingKeyMap.has(key))
      .map((key) => ({ name: key, isSearchable: true }))

    if (newKeyData.length) {
      await prisma.tagKey.createMany({ data: newKeyData, skipDuplicates: true })
    }

    // reloads all tag keys
    const allTagKeys = await prisma.tagKey.findMany({ where: { name: { in: keyNames } } })
    const keyIdMap = new Map(allTagKeys.map((key) => [key.name, key.id]))

    // prepares tag entries (keyId + value)
    const tagEntries = tags.map((tag) => ({ keyId: keyIdMap.get(tag.key), value: tag.value }))

    // fetches existing tags
    const existingTags = await prisma.tag.findMany({
      where: { OR: tagEntries },
    })
    const existingTagSet = new Set(existingTags.map((tag) => `${tag.keyId}:${tag.value}`))

    // creates missing tags
    const newTagData = tagEntries.filter(
      (entry) => !existingTagSet.has(`${entry.keyId}:${entry.value}`)
    )

    if (newTagData.length) {
      await prisma.tag.createMany({ data: newTagData, skipDuplicates: true })
    }

    // creates product with tag connections
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        tags: {
          connect: tagEntries.map((entry) => ({
            keyId_value: { keyId: entry.keyId, value: entry.value },
          })),
        },
      },
    })

    // uploads and saves images if provided
    if (images.length > 0) {
      const uploaded = await Promise.all(
        images.map((image) => uploadImage(image.base64, "product", newProduct.id, true))
      )

      const imageData = uploaded.map((uploadedImage, imageIndex) => ({
        imageURL: uploadedImage.secure_url,
        position: imageIndex,
        productId: newProduct.id,
      }))

      await prisma.productImage.createMany({ data: imageData })
    }

    // fetches full product data with tags and images
    const fullProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        tags: {
          orderBy: [{ tagKey: { name: "asc" } }, { value: "asc" }],
          include: { tagKey: { select: { name: true } } },
        },
        images: { orderBy: { position: "asc" } },
      },
    })

    return res.status(201).json(fullProduct)
  } catch (error) {
    console.error("create product error:", error)
    return res.status(500).json({ message: "failed to create product" })
  }
}

// edits product
// works incorrectly, needs fixing, when update tag's isSearchable value before this tag was created, it will not be applied, and will throw an error
// PROTECTED [ADMIN]
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
      searchTagIds = [],
      removedSearchTagIds = [],
    } = req.body

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res.status(400).json({ message: "price must be a positive number" })
    }
    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
      return res.status(400).json({ message: "stock must be a non-negative number" })
    }

    // fetches existing product with its images and tags
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, tags: true },
    })
    if (!existingProduct) {
      return res.status(404).json({ message: "product not found" })
    }

    // splits images into new vs existing based on url presence
    const newImages = []
    const oldImages = []
    images.forEach((image, imageIndex) => {
      if (image?.url?.startsWith("https://") || image?.imageURL?.startsWith("https://")) {
        oldImages.push({ ...image, position: imageIndex })
      } else {
        newImages.push({ ...image, position: imageIndex })
      }
    })

    // updates positions of existing images
    for (const image of oldImages) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: { position: image.position },
      })
    }

    // deletes removed images
    if (deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: { id: { in: deletedImageIds.filter((imageId) => imageId != null) } },
      })
    }

    // uploads and creates new images
    if (newImages.length > 0) {
      const uploaded = await Promise.all(
        newImages.map((image) => uploadImage(image.base64, "product", id, true))
      )
      const toCreate = uploaded.map((uploadedImage, imageIndex) => ({
        imageURL: uploadedImage.secure_url,
        position: newImages[imageIndex].position,
        productId: id,
      }))
      await prisma.productImage.createMany({ data: toCreate })
    }

    // splits incoming tags into those with an id (to update) vs new ones
    const tagsToUpdate = tags
      .filter((tag) => tag.id)
      .map((tag) => ({ ...tag, key: tag.key?.trim(), value: tag.value?.trim() }))
    const incomingNewTags = tags
      .filter((tag) => !tag.id)
      .map((tag) => ({ ...tag, key: tag.key?.trim(), value: tag.value?.trim() }))

    // updates any renamed or re-keyed tags
    const updatedTags = await Promise.all(
      tagsToUpdate.map(async ({ id: tagId, key, value }) => {
        const existingTag = await prisma.tag.findFirst({
          where: {
            tagKey: { name: key },
            value: value,
          },
        })
        if (existingTag) {
          return { id: existingTag.id }
        } else {
          const updated = await prisma.tag.update({
            where: { id: tagId },
            data: {
              value,
              tagKey: {
                connectOrCreate: {
                  where: { name: key },
                  create: { name: key },
                },
              },
            },
          })
          return { id: updated.id }
        }
      })
    )

    // finds existing tags among the new ones by tagKey.name + value
    const found = await prisma.tag.findMany({
      where: {
        OR: incomingNewTags.map((tag) => ({
          tagKey: { name: tag.key },
          value: tag.value,
        })),
      },
      include: { tagKey: true },
    })
    const foundMap = new Map(found.map((tag) => [`${tag.tagKey.name}:${tag.value}`, tag]))

    // creates any that still don’t exist
    const createdTags = []
    for (const { key, value } of incomingNewTags) {
      const mapKey = `${key}:${value}`
      if (!foundMap.has(mapKey)) {
        const created = await prisma.tag.create({
          data: {
            value,
            tagKey: {
              connectOrCreate: {
                where: { name: key },
                create: { name: key },
              },
            },
          },
        })
        createdTags.push({ id: created.id })
      }
    }

    // assembles final list of tag ids to connect
    const allToConnect = [...updatedTags, ...found.map((tag) => ({ id: tag.id })), ...createdTags]

    // builds tags payload for product update
    const data = {
      tags: {
        connect: allToConnect,
        ...(deletedTagIds.length
          ? { disconnect: deletedTagIds.map((tagId) => ({ id: tagId })) }
          : {}),
      },
    }

    // sets other product fields if provided
    if (name) data.name = name
    if (description) data.description = description
    if (price !== undefined) data.price = Number(price)
    if (stock !== undefined) data.stock = Number(stock)

    // updates tagKeys as searchable
    await prisma.tagKey.updateMany({
      where: {
        OR: [{ name: { in: searchTagIds } }, { tags: { some: { id: { in: searchTagIds } } } }],
      },
      data: { isSearchable: true },
    })

    if (removedSearchTagIds.length > 0) {
      const tagsToUnmark = await prisma.tag.findMany({
        where: { id: { in: removedSearchTagIds } },
        select: { keyId: true },
      })
      const keyIds = tagsToUnmark.map((tag) => tag.keyId)
      await prisma.tagKey.updateMany({
        where: { id: { in: keyIds } },
        data: { isSearchable: false },
      })
    }

    // updates product record including tags and images
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

// delists product
// PROTECTED [ADMIN]
export const delistProduct = async (req, res) => {
  try {
    const { id } = req.params

    // returns bad request if no product id provided
    if (!id) {
      return res.status(400).json({ message: "product id is required" })
    }

    // fetches existing product
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: "product not found" })
    }

    // updates product status to DELISTED
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status: "DELISTED" },
    })

    // responds with confirmation and updated product
    return res.status(200).json({ message: "product delisted", product: updatedProduct })
  } catch (error) {
    console.error("delist product error:", error)
    return res.status(500).json({ message: "failed to delist product" })
  }
}

// gets searchable tag keys and values with price range
// PUBLIC
export const getSearchTags = async (req, res) => {
  try {
    const tagKeys = await prisma.tagKey.findMany({
      where: { isSearchable: true },
      include: {
        tags: {
          select: { value: true },
          distinct: ["value"],
        },
      },
    })

    // fetches price range from active products
    const priceRange = await prisma.product.aggregate({
      where: { status: "ACTIVE" },
      _min: { price: true },
      _max: { price: true },
    })

    const tags = tagKeys
      .map((tagKey) => ({
        key: tagKey.name,
        values: tagKey.tags.map((tag) => tag.value).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.key.localeCompare(b.key))

    res.status(200).json({
      tags: tags,
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "internal server error" })
  }
}
