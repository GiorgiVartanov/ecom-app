import cloudinary from "../config/cloudinary"

const uploadImage = async (image, directory, productId) => {
  // setting upload options
  const options = {
    folder: `ecom-app-${directory}`,
    public_id: productId,
    resource_type: "image",
  }

  // performing upload
  const result = await cloudinary.uploader.upload(image, options)
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  }
}

export default uploadImage
