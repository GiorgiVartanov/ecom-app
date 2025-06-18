import axios from "./axiosConfig"

export const addItemToCart = async (id, token) => {
  const res = await axios.post(
    `/cart/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}

export const removeItemFromCart = async (id, token) => {
  const res = await axios.delete(`/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getCart = async (token) => {
  const res = await axios.get(`/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const editCartItem = async (id, { quantity }, token) => {
  const res = await axios.patch(
    `/cart/${id}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}
