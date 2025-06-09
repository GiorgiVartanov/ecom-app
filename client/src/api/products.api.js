import axios from "./axiosConfig"

export const getProducts = (params) => axios.get("/products", { params })

export const getProduct = (id) => axios.get(`/products/${id}`)

export const createProduct = ({ name, description, price, stock, tags, images }, token) =>
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

export const updateProduct = (
  id,
  { name, description, price, stock, status, tags, selectableOptions, images },
  token
) =>
  axios.patch(
    `/products/${id}`,
    { name, description, price, stock, status, tags, selectableOptions, images },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

export const delistProduct = (id, token) =>
  axios.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
