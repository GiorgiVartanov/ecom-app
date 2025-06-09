import axios from "./axiosConfig"

export const signUp = ({ name, email, password }) =>
  axios.post("/auth/signup", { name, email, password })

export const signIn = ({ email, password }) => axios.post("/auth/signin", { email, password })
