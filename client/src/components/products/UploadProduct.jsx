import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { createProduct, updateProduct } from "../../api/products.api"
import convertToBase64 from "../../util/convertToBase64"
import useAuthStore from "../../store/useAuthStore"

import Input from "../common/Input"
import TextArea from "../common/TextArea"
import Button from "../common/Button"
import PreviewImage from "./PreviewImage"
import TagFields from "./TagFields"

const UploadProduct = ({ defaultData, isEditing = false, id }) => {
  const token = useAuthStore((state) => state.token)

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [images, setImages] = useState([])
  const [deletedImageIds, setDeletedImages] = useState([])
  const [deletedTagIds, setDeletedTagIds] = useState([])

  const fileInputRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    // mode: "all",
    defaultValues: defaultData || {
      name: "",
      description: "",
      price: "",
      stock: "",
      tags: [],
    },
  })

  // console.log(images)

  const mutation = useMutation({
    mutationFn: ({ data }) =>
      isEditing ? updateProduct(id, data, token) : createProduct(data, token),
    onMutate: async ({ data }) => {
      const previousProduct = queryClient.getQueryData(["product", "admin", id])

      await queryClient.cancelQueries(["product", "admin", id])

      queryClient.setQueryData(["product", "admin", id], {
        ...previousProduct,
        ...data,
      })

      return { previousProduct }
    },
    onSuccess: ({ data }) => {
      reset()
      // setImages([])
      // setDeletedImages([])
      if (fileInputRef.current) fileInputRef.current.value = ""

      const newId = data?.id
      if (newId) navigate(`/dashboard/products/edit/${newId}`)
    },
    onError: (error, variables, context) => {
      if (isEditing && context?.previousProduct) {
        queryClient.setQueryData(["product", "admin", id], context.previousProduct)
      }
    },
  })

  const onSubmit = (formData) => {
    const { name, description, price, stock, tags } = formData

    // console.log(formData)

    const data = {
      name,
      description,
      price,
      stock,
      tags,
      deletedTagIds,
      images,
      deletedImageIds,
    }

    mutation.mutate({ data })
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || [])
    const converted = await Promise.all(
      files.map(async (file, index) => {
        const base64 = await convertToBase64(file)
        return { base64, imageURL: URL.createObjectURL(file), position: images.length + index }
      })
    )

    setImages((prev) => [...prev, ...converted])
  }

  const handleRemove = (indexToRemove) => {
    // console.log({ indexToRemove })
    // console.log({ images })
    // console.log({ deletedImages })

    // if (images[indexToRemove])
    setDeletedImages((prevState) => [...prevState, images[indexToRemove].id])
    setImages((prevState) => prevState.filter((image, index) => index !== indexToRemove))
  }

  const moveUp = (index) => {
    if (index === 0) return
    setImages((prev) => {
      const newArr = [...prev]
      ;[newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]]
      return newArr
    })
  }

  const moveDown = (index) => {
    if (index === images.length - 1) return
    setImages((prev) => {
      const newArr = [...prev]
      ;[newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]]
      return newArr
    })
  }

  const handleTagRemove = (id) => {
    setDeletedTagIds((prevState) => [...prevState, id])
  }

  useEffect(() => {
    if (defaultData) {
      reset({
        name: defaultData.name,
        description: defaultData.description,
        price: defaultData.price,
        stock: defaultData.stock,
        tags: defaultData.tags,
      })

      // console.log(defaultData)

      const orderedImages = defaultData.images
        .sort((a, b) => a.position - b.position)
        .map((image) => image)

      setImages(orderedImages)
    }
  }, [defaultData, reset])

  // console.log(images)

  return (
    <div className="p-4 max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <TextArea
          label="Name"
          {...register("name", { required: "name is required" })}
          error={errors.name?.message}
          itemClassName="h-32"
        />
        <TextArea
          label="Description"
          {...register("description")}
          itemClassName="h-64"
        />
        <Input
          label="Price"
          type="text"
          inputMode="decimal"
          {...register("price", {
            required: "price is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
            },
            setValueAs: (v) => parseFloat(v),
          })}
          onKeyDown={(e) => {
            const control = [
              "Backspace",
              "Tab",
              "Enter",
              "Escape",
              "ArrowLeft",
              "ArrowRight",
              "Delete",
            ]
            if (e.ctrlKey || e.metaKey) return
            if (control.includes(e.key)) return
            const { value, selectionStart } = e.currentTarget
            // block extra dot
            if (e.key === ".") {
              if (value.includes(".")) e.preventDefault()
              return
            }
            // block non‑digit
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault()
              return
            }
            // block more than two decimals
            const dotIndex = value.indexOf(".")
            if (dotIndex >= 0 && selectionStart > dotIndex) {
              const decimals = value.slice(dotIndex + 1)
              if (decimals.length >= 2) e.preventDefault()
            }
          }}
          onPaste={(e) => {
            const paste = (e.clipboardData || window.clipboardData).getData("text")
            // allow at most two decimals
            if (!/^\d+(\.\d{1,2})?$/.test(paste)) e.preventDefault()
          }}
          error={errors.price?.message}
        />

        <Input
          label="Stock"
          type="text"
          inputMode="numeric"
          {...register("stock", {
            required: "stock is required",
            pattern: {
              value: /^\d+$/, // integers only
            },
            setValueAs: (v) => parseInt(v, 10),
          })}
          onKeyDown={(e) => {
            // keys we always allow
            const controlKeys = [
              "Backspace",
              "Tab",
              "Enter",
              "Escape",
              "ArrowLeft",
              "ArrowRight",
              "Delete",
            ]
            if (e.ctrlKey || e.metaKey) return
            if (controlKeys.includes(e.key)) return
            // allow digits only
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault() // block letters and symbols
            }
          }}
          onPaste={(e) => {
            const paste = (e.clipboardData || window.Clipboard).getData("text")
            if (!/^\d+$/.test(paste)) {
              e.preventDefault() // block pastes with non-digits
            }
          }}
          error={errors.stock?.message}
        />

        <TagFields
          control={control}
          register={register}
          errors={errors}
          onRemove={handleTagRemove}
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
          {/* {images.length > 0 && ` (${images.length} selected)`} */}
        </Button>

        <div className="flex flex-col flex-wrap gap-3">
          {images.map((image, index) => (
            <PreviewImage
              key={image.id || index}
              url={image.imageURL || image.base64}
              index={index}
              onRemove={handleRemove}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              isFirst={index === 0}
              isLast={index === images.length - 1}
            />
          ))}
        </div>

        <Button
          disabled={!isValid || mutation.isPending}
          type="submit"
        >
          save
        </Button>
      </form>

      {mutation.isPending && <p className="mt-4">uploading...</p>}
      {mutation.isSuccess && <p className="mt-4 text-green-600">product uploaded</p>}
      {mutation.isError && <p className="mt-4 text-red-600">upload failed</p>}
    </div>
  )
}

export default UploadProduct
