import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import { createProduct } from "../../api/products.api"
import convertToBase64 from "../../util/convertToBase64"
import useAuthStore from "../../store/useAuthStore"

import Input from "../common/Input"
import Button from "../common/Button"
import PreviewImage from "./PreviewImage"
import TagFields from "./TagFields"

const UploadProduct = () => {
  const token = useAuthStore((state) => state.token)

  const [imageData, setImageData] = useState([])
  const fileInputRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const mutation = useMutation({
    mutationFn: ({ data }) => createProduct(data, token),
    onSuccess: () => {
      reset()
      setImageData([])
      // clearing file input after successful upload
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
  })

  const onSubmit = (formData) => {
    const { name, description, price, stock, tags } = formData

    console.log(imageData)

    const data = {
      name,
      description,
      price,
      stock,
      tags,
      images: imageData.map((item) => item.base64),
    }

    mutation.mutate({ data })
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || [])
    const converted = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertToBase64(file)
        return { base64, preview: URL.createObjectURL(file) }
      })
    )

    setImageData((prev) => [...prev, ...converted])
  }

  const handleRemove = (index) => {
    setImageData((prev) => prev.filter((_, i) => i !== index))
  }

  const moveUp = (index) => {
    if (index === 0) return
    setImageData((prev) => {
      const newArr = [...prev]
      ;[newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]]
      return newArr
    })
  }

  const moveDown = (index) => {
    if (index === imageData.length - 1) return
    setImageData((prev) => {
      const newArr = [...prev]
      ;[newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]]
      return newArr
    })
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="Name"
          {...register("name", { required: "name is required" })}
          error={errors.name?.message}
        />
        <Input
          label="Description"
          {...register("description")}
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { required: "price is required" })}
          error={errors.price?.message}
        />
        <Input
          label="Stock"
          type="number"
          {...register("stock", { required: "stock is required" })}
          error={errors.stock?.message}
        />
        <TagFields
          control={control}
          register={register}
          errors={errors}
        />

        {/* hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />

        {/* upload button opens file dialog */}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          upload images
          {imageData.length > 0 && ` (${imageData.length} selected)`}
        </Button>

        <div className="flex flex-col flex-wrap gap-3">
          {imageData.map(({ preview }, idx) => (
            <PreviewImage
              key={idx}
              preview={preview}
              idx={idx}
              onRemove={handleRemove}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              isFirst={idx === 0}
              isLast={idx === imageData.length - 1}
            />
          ))}
        </div>

        <Button type="submit">save</Button>
      </form>

      {mutation.isPending && <p className="mt-4">uploading...</p>}
      {mutation.isSuccess && <p className="mt-4 text-green-600">product uploaded</p>}
      {mutation.isError && <p className="mt-4 text-red-600">upload failed</p>}
    </div>
  )
}

export default UploadProduct
