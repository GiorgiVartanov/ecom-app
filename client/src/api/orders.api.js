import axios from "./axiosConfig"

export const createOrder = async (order, token) => {
  const res = await axios.post(
    "/order",
    { order },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}

export const getOrder = async (orderId, token) => {
  const res = await axios.get(`/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getOrderList = async (token) => {
  const res = await axios.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getUserOrderList = async (userId, token) => {
  const res = await axios.get(`/order/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const getAllOrders = async (token) => {
  const res = await axios.get("/order/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data
}

export const updateOrderStatus = async (orderId, status, token) => {
  const res = await axios.patch(
    `/order/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}
