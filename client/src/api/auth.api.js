import axios from "./axiosConfig"

export const signUp = ({ name, email, password, confirmPassword }) =>
  axios.post("/auth/signup", { name, email, password, confirmPassword })

export const signIn = ({ email, password }) => axios.post("/auth/signin", { email, password })
