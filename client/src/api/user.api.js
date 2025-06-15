import axios from "./axiosConfig"

export const getUser = async (id) => {
  const res = await axios.get(`/user/${id}`)

  return res.data
}
