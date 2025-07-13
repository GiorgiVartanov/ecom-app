import { v2 as cloudinary } from "cloudinary"

const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}

cloudinary.config({
  cloud_name: requiredEnvVars.CLOUDINARY_CLOUD_NAME,
  api_key: requiredEnvVars.CLOUDINARY_API_KEY,
  api_secret: requiredEnvVars.CLOUDINARY_API_SECRET,
})

export default cloudinary
