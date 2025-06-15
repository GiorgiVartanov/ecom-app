import { useState } from "react"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { getProduct } from "../api/products.api"
import ArrowIcon from "../assets/icons/arrow.svg?react"
import ProductImageSelect from "../components/products/ProductImageSelect"
import TagList from "../components/products/TagList"

const createQuery = (id) => ({
  queryKey: ["product", id],
  queryFn: async () => getProduct(id),
})

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const query = createQuery(params.id)
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
  }

const Product = () => {
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: product, isLoading, error } = useQuery(createQuery(id))

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1 >= product.images?.length ? 0 : prev + 1))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 < 0 ? product.images.length - 1 : prev - 1))
  }

  const handleSelectImage = (index) => {
    setCurrentImageIndex(index)
  }

  const renderImage = () => {
    if (!product) return null

    return (
      <div>
        {/* <div className="relative flex flex-col items-center justify-center rounded-2xl shadow p-4 bg-gray-50 h-96"> */}
        <div className="relative flex flex-col items-center justify-center rounded-2xl shadow p-4 h-96">
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full shadow transition-all duration-200 hover:bg-gray-100/20"
          >
            <ArrowIcon className="w-6 h-6 rotate-270" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full shadow transition-all duration-200 hover:bg-gray-100/20"
          >
            <ArrowIcon className="w-6 h-6 rotate-90" />
          </button>
          {product.images?.[currentImageIndex]?.imageURL ? (
            <img
              src={product.images[currentImageIndex].imageURL}
              alt={product.name}
              className="object-contain rounded-xl max-h-full"
            />
          ) : (
            <div className="text-gray-400">image not found</div>
          )}
        </div>
        {product.images?.length > 1 && (
          <ProductImageSelect
            images={product.images.map((img) => img.imageURL)}
            handleSelectImage={handleSelectImage}
            currentIndex={currentImageIndex}
            className="mt-4"
          />
        )}
      </div>
    )
  }

  const renderInfo = () => {
    if (!product) return null

    const { name, description, price, stock, tags } = product

    return (
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-xl font-bold">{price}$</p>
        <p className="text-sm text-gray-600">{stock > 0 ? `in stock: ${stock}` : "out of stock"}</p>
        {description && <p className="text-gray-700 text-sm">{description}</p>}
        <TagList tags={tags} />
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div>Loading...</div>
        </div>
      )
    }
    if (error || !product) {
      return <div className="text-center text-red-500">something went wrong</div>
    }
    return (
      <>
        {renderImage()}
        {renderInfo()}
      </>
    )
  }

  return (
    <div className="mt-20 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[calc(100vh-8rem)]">
      {renderContent()}
    </div>
  )
}

export default Product
