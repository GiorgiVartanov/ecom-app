import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { createProduct, updateProduct } from "../../api/products.api"
import convertToBase64 from "../../util/convertToBase64"
import useAuthStore from "../../store/useAuthStore"
import Input from "../common/Input"
import TextArea from "../common/TextArea"
import Button from "../common/Button"
import PreviewImage from "./PreviewImage"
import TagFields from "./TagFields"

// zod schemas for product upload

const tagSchema = z.object({
  key: z.string().nonempty("tag key is required"),
  value: z.string().optional(),
})

const productSchema = z.object({
  name: z.string().nonempty("name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .nonempty("price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && /^\d+(\.\d{1,2})?$/.test(val),
      { message: "price must be a positive number with up to 2 decimals" }
    ),
  stock: z
    .string()
    .nonempty("stock is required")
    .refine(
      (val) => !isNaN(parseInt(val, 10)) && Number.isInteger(Number(val)) && parseInt(val, 10) >= 0,
      { message: "stock must be a non-negative integer" }
    ),
  tags: z.array(tagSchema),
})

// renders a form for uploading a product, accepts default data and id for editing
const UploadProduct = ({ defaultData, isEditing = false, id }) => {
  const token = useAuthStore((state) => state.token)

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [images, setImages] = useState([])
  const [deletedImageIds, setDeletedImages] = useState([])
  const [deletedTagIds, setDeletedTagIds] = useState([])
  const [searchTagIds, setSearchTagIds] = useState([])
  const [removedSearchTagIds, setRemovedSearchTagIds] = useState([])

  const fileInputRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultData || {
      name: "",
      description: "",
      price: "",
      stock: "",
      tags: [],
    },
    mode: "onChange",
    criteriaMode: "all",
  })

  const mutation = useMutation({
    mutationFn: ({ data }) =>
      isEditing ? updateProduct(id, data, token) : createProduct(data, token),
    onMutate: async () => {
      const previousProduct = queryClient.getQueryData(["product", "admin", id])

      await queryClient.cancelQueries(["product", "admin", id])

      // await queryClient.invalidateQueries(["product", "admin", id])
      // await queryClient.invalidateQueries(["product", "admin", id])

      // queryClient.setQueryData(["product", "admin", id], {
      //   ...previousProduct,
      //   ...data,
      // })

      return { previousProduct }
    },
    onSuccess: ({ data }) => {
      reset()
      if (fileInputRef.current) fileInputRef.current.value = ""

      queryClient.invalidateQueries("tags")

      toast.dismiss()

      if (isEditing) {
        toast.success("Product updated successfully")
      } else {
        toast.success("Product created successfully")
      }

      const newId = data?.id
      if (newId) navigate(`/dashboard/products/edit/${newId}`, { replace: true })
    },
    onError: (error, variables, context) => {
      console.error("Error uploading product:", error)
      toast.error(error?.response?.data?.message || "Failed to upload product")
      setError("root", { message: error?.response?.data?.message || "Failed to upload product" })

      if (isEditing && context?.previousProduct) {
        queryClient.setQueryData(["product", "admin", id], context.previousProduct)
      }
    },
  })

  const onSubmit = (formData) => {
    const { name, description, price, stock, tags } = formData

    const tagKeys = tags.map((tag) => tag.key.trim()).filter(Boolean)

    const frequency = new Map()
    const duplicatedKeys = new Set()

    tagKeys.forEach((key) => {
      const count = frequency.get(key) || 0
      frequency.set(key, count + 1)
      if (count + 1 === 2) {
        duplicatedKeys.add(key)
      }
    })

    if (duplicatedKeys.size > 0) {
      const duplicatedArray = Array.from(duplicatedKeys)

      toast.error(
        `each tag key should only be used once. duplicates: ${duplicatedArray.join(", ")}`
      )
      return
    }

    const data = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      tags,
      deletedTagIds,
      images,
      deletedImageIds,
      searchTagIds,
      removedSearchTagIds,
    }

    mutation.mutate({ data })
  }

  const handleImageChange = async (e) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB in bytes
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} file is too large. Maximum allowed size is 10MB.`)
        return false
      }
      return true
    })

    const converted = await Promise.all(
      validFiles.map(async (file, index) => {
        const base64 = await convertToBase64(file)
        return { base64, imageURL: URL.createObjectURL(file), position: images.length + index }
      })
    )

    setImages((prev) => [...prev, ...converted])
  }

  // rename
  const handleRemove = (indexToRemove) => {
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
    if (!id) {
      toast.success("Tag removed successfully")
      return
    }

    toast.success("Tag removed successfully, it will be deleted on save")
    setDeletedTagIds((prevState) => [...prevState, id])
  }

  const handleSetAsSearchTag = (id) => {
    // this implementation is terrible, I pass id, but if id does not exist (new item) I pass name

    setSearchTagIds((prevState) => [...prevState, id])
    setRemovedSearchTagIds((prevState) => prevState.filter((tagId) => tagId !== id))
  }

  const handleRemoveFromSearchTags = (id) => {
    setSearchTagIds((prevState) => prevState.filter((tagId) => tagId !== id))
    setRemovedSearchTagIds((prevState) => [...prevState, id])
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

      const orderedImages = defaultData.images
        .sort((a, b) => a.position - b.position)
        .map((image) => image)

      setImages(orderedImages)
    }
  }, [defaultData, reset])

  return (
    <div className="p-4 max-w-lg mx-auto text-sm">
      <h2 className="border-b-2 border-gray-200 mb-4 pb-4 text-lg font-semibold text-gray-700">
        {isEditing ? "Edit Product" : "Create Product"}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <TextArea
          label="Name"
          {...register("name")}
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
          {...register("price")}
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
          {...register("stock")}
          onKeyDown={(e) => {
            // keys that always are allowed
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
            // allows only digits
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault() // blocks letters and symbols
            }
          }}
          onPaste={(e) => {
            const paste = (e.clipboardData || window.Clipboard).getData("text")
            if (!/^\d+$/.test(paste)) {
              e.preventDefault() // blocks pastes with non-digits
            }
          }}
          error={errors.stock?.message}
        />

        <TagFields
          control={control}
          register={register}
          setAsSearchTag={handleSetAsSearchTag}
          removeFromSearchTags={handleRemoveFromSearchTags}
          searchTagIds={searchTagIds}
          removedSearchTagIds={removedSearchTagIds}
          errors={errors}
          clearErrors={clearErrors}
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
          variant="primary"
          className="bg-primary-gradient"
          onClick={() => fileInputRef.current?.click()}
        >
          upload images
        </Button>

        <div className=" flex flex-col flex-wrap gap-1 gap-y-8 w-full justify-center md:grid md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] md:auto-rows-auto">
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
              className="h-ful w-full md:h-48 md:w-48 mx-auto md:mx-0 rounded shadow-md bg-white p-2 pb-6 object-contain"
            />
          ))}
        </div>

        <Button
          isPending={mutation.isPending}
          disabled={!isValid}
          variant="primary"
          type="submit"
          className="px-12 text-md py-3 mt-6 bg-green"
          disabledTooltip="you need to fill all fields"
        >
          save
        </Button>
      </form>
    </div>
  )
}

export default UploadProduct
