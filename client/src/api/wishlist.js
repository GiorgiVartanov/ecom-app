import axios from "./axiosConfig"

export const addItemToWishlist = async (id, token) => {
  const res = await axios.post(
    `/wishlist/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}

export const removeItemFromWishList = async (id, token) => {
  const res = await axios.delete(`/wishlist/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getWishList = async (id) => {
  const res = await axios.get(`/wishlist/${id}`)

  return res.data
}
