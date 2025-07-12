import axios from "./axiosConfig"

export const getProducts = async (filters, token) => {
  const res = await axios.get("/products", {
    params: filters,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getProduct = async (id, token) => {
  const res = await axios.get(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const createProduct = async (
  { name, description, price, stock, tags, images, searchTagIds, removedSearchTagIds },
  token
) => {
  return await axios.post(
    "/products",
    {
      name,
      description,
      price,
      stock,
      tags,
      images,
      searchTagIds,
      removedSearchTagIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export const updateProduct = async (
  id,
  {
    name,
    description,
    price,
    stock,
    tags,
    deletedTagIds,
    images,
    deletedImageIds,
    searchTagIds,
    removedSearchTagIds,
  },
  token
) => {
  return await axios.patch(
    `/products/${id}`,
    {
      name,
      description,
      price,
      stock,
      tags,
      deletedTagIds,
      images,
      deletedImageIds,
      searchTagIds,
      removedSearchTagIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export const delistProduct = async (id, token) => {
  return await axios.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const writeReview = async (id, { rating, comment, reviewId }, token) => {
  const res = axios.post(
    `/products/${id}/reviews`,
    { rating, comment, reviewId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}

export const deleteReview = async (id, reviewId, token) => {
  return await axios.delete(`/products/${id}/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getSearchTags = async () => {
  const res = await axios.get("/products/tags")

  return res.data
}
