import axios from "./axiosConfig"

export const getProducts = async (filters) => {
  const res = await axios.get("/products", { params: filters })
  return res.data
}

export const getProduct = async (id) => {
  const res = await axios.get(`/products/${id}`)

  return res.data
}

export const createProduct = async ({ name, description, price, stock, tags, images }, token) =>
  axios.post(
    "/products",
    {
      name,
      description,
      price,
      stock,
      tags,
      images,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const updateProduct = async (
  id,
  { name, description, price, stock, tags, deletedTagIds, images, deletedImageIds },
  token
) => {
  console.log({ deletedTagIds })

  return await axios.patch(
    `/products/${id}`,
    { name, description, price, stock, tags, deletedTagIds, images, deletedImageIds },
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
