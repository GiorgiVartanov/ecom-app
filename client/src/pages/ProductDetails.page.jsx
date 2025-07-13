import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getProduct } from "../api/products.api"
import { addItemToCart, removeItemFromCart } from "../api/cart.api"
import { addItemToWishlist, removeItemFromWishList } from "../api/wishlist.api"
import useAuthStore from "../store/useAuthStore"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import ArrowIcon from "../assets/icons/arrow.svg?react"
import CartIcon from "../assets/icons/cart.svg?react"
import HeartIcon from "../assets/icons/heart.svg?react"

import ProductImageSelect from "../components/products/ProductImageSelect"
import ReviewList from "../components/reviews/ReviewList"
import ReviewInput from "../components/reviews/ReviewInput"

import TagList from "../components/products/TagList"
import Button from "../components/common/Button"
import Image from "../components/common/Image"
import Loading from "../components/common/Loading"

export const createQuery = (id, token) => ({
  queryFn: async () => getProduct(id, token),
  queryKey: ["product", id, token ? "logged-in" : "not-logged-in"], // if user is logged in query also includes isInCart, isWishlisted and hasPurchased
})

const Product = () => {
  const [, setDocumentTitle] = useDocumentTitle("Product Details")

  const { id } = useParams()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const navigate = useNavigate()

  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  const { data: product, isLoading, error } = useQuery(createQuery(id, token))

  useEffect(() => {
    if (product?.name) {
      // after product is fetched from a backend - sets page's title to its name
      setDocumentTitle(`${product.name} - PcPal`)
    }
  }, [product?.name, setDocumentTitle])

  const queryClient = useQueryClient()

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1 >= product.images?.length ? 0 : prev + 1))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 < 0 ? product.images.length - 1 : prev - 1))
  }

  const handleSelectImage = (index) => {
    setCurrentImageIndex(index)
  }

  const handleGoToCheckout = () => {
    if (!token) {
      navigate("/login")
      return
    }

    if (product && product.isInCart) {
      navigate("/checkout")
    } else {
      addItemMutation.mutate()
      navigate("/checkout")
    }
  }

  const addItemMutation = useMutation({
    mutationFn: () => addItemToCart(id, token),
    onSettled: () => {
      queryClient.invalidateQueries(createQuery(id, token).queryKey)
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: () => removeItemFromCart(id, token),
    onSettled: () => {
      queryClient.invalidateQueries(createQuery(id, token).queryKey)
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  const addItemToWishlistMutation = useMutation({
    mutationFn: () => addItemToWishlist(id, token),
    onSettled: () => {
      queryClient.invalidateQueries(createQuery(id, token).queryKey)
      queryClient.invalidateQueries(["wishlist", user.id])
    },
  })

  const removeItemFromWishlistMutation = useMutation({
    mutationFn: () => removeItemFromWishList(id, token),
    onSettled: () => {
      queryClient.invalidateQueries(createQuery(id, token).queryKey)
      queryClient.invalidateQueries(["wishlist", user.id])
    },
  })

  const renderImage = () => {
    if (!product) return null

    return (
      <div className="flex-5/10 mb-24 md:mb-0">
        {/* <div className="relative flex flex-col items-center justify-center rounded-2xl shadow p-4 bg-gray-50 h-96"> */}
        <div className="relative flex flex-col items-center justify-center rounded-2xl shadow p-4 h-96">
          {product.images.length > 1 ? (
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 transition-smooth hover:opacity-70"
            >
              <ArrowIcon className="w-6 h-6 rotate-270" />
            </button>
          ) : (
            ""
          )}
          {product.images.length > 1 ? (
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-smooth hover:opacity-70"
            >
              <ArrowIcon className="w-6 h-6 rotate-90" />
            </button>
          ) : (
            ""
          )}
          {product.images?.[currentImageIndex]?.imageURL ? (
            <Image
              src={product.images[currentImageIndex].imageURL}
              alt={product.name}
              className="object-contain rounded-xl max-h-full"
            />
          ) : (
            <div className="text-gray-400">image not found</div>
          )}
        </div>
        <div className={`absolute`}>
          {product.images?.length > 1 ? (
            <ProductImageSelect
              images={product.images.map((img) => img.imageURL)}
              handleSelectImage={handleSelectImage}
              currentIndex={currentImageIndex}
              className="mt-4"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    )
  }

  const renderInfo = () => {
    if (!product) return null

    const { name, description, price, stock, isInCart, isWishlisted } = product

    const renderCartButtons = () => {
      if (!token) return

      return (
        <div className="flex gap-2 mt-auto">
          <Button
            to="/checkout"
            // className="flex items-center bg-primary-gradient text-white/90"
            variant="primary"
            wrapperClassName="mr-4"
            disabled={!token}
            tooltip={token ? "buy now" : "login to buy"}
            onClick={handleGoToCheckout}
          >
            Buy
          </Button>
          {isInCart ? (
            <Button
              onClick={removeItemMutation.mutate}
              variant="primary"
              disabled={!token}
              tooltip="remove from cart"
            >
              <CartIcon className="icon text-blue-500 group-hover:text-blue-500/70" />
            </Button>
          ) : (
            <Button
              onClick={addItemMutation.mutate}
              variant="primary"
              disabled={stock <= 0 || !token}
              tooltip={stock > 0 ? "add to cart" : "out of stock"}
            >
              <CartIcon className="icon text-white/90" />
            </Button>
          )}
          {isWishlisted ? (
            <Button
              onClick={removeItemFromWishlistMutation.mutate}
              // className="w-fit text-sm bg-primary-gradient group"
              variant="primary"
              disabled={!token}
              tooltip={"remove from wishlist"}
            >
              <HeartIcon className="icon text-red-400 group-hover:text-red-400/70" />
            </Button>
          ) : (
            <Button
              onClick={addItemToWishlistMutation.mutate}
              // className="w-fit text-sm bg-primary-gradient"
              variant="primary"
              disabled={!token}
              tooltip={token ? "add to wishlist" : "login to add to wishlist"}
            >
              <HeartIcon className="icon text-white/90" />
            </Button>
          )}
          <p className="text-sm text-gray-600 mt-auto ml-4">
            {stock > 0 ? `stock: ${stock}` : "out of stock"}
          </p>
        </div>
      )
    }

    const renderDescription = () => {
      if (!description) {
        return <p className="text-gray-700 text-sm">no description provided</p>
      }

      return (
        <p className="w-full text-justify text-gray-700 text-sm last:whitespace-pre-wrap border-t border-gray-200 pt-2 leading-normal break-keep !overflow-x-hidden h-fit overflow-y-auto pr-3 max-h-64">
          {description}
        </p>
      )
    }

    return (
      <div className="flex flex-5/10 flex-col gap-4">
        <h1 className="w-full text-justify text-gray-800 text-lg last:whitespace-pre-wrap leading-normal break-keep !overflow-x-hidden h-fit max-h-96 overflow-y-auto pr-2 font-semibold">
          {name}
        </h1>
        <p className="text-md text-gray-800">{price}$</p>
        {renderDescription()}
        {renderCartButtons()}
      </div>
    )
  }

  const renderComments = () => {
    if (!product) return null

    // reviews are fetched together with a product, and without pagination
    const currentUsersComment = product.reviews.find((review) => review.user.id === user?.id)

    // console.log({ reviews: product.reviews })
    // console.log({ user: user })

    return (
      <div className="mt-6 w-full col-span-2">
        {token && product.hasPurchased ? (
          <ReviewInput
            productId={id}
            defaultComment={currentUsersComment?.text}
            defaultRating={currentUsersComment?.score}
            reviewId={currentUsersComment?.id}
          />
        ) : (
          ""
        )}
        {product.reviews.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 mt-8 pt-2 border-t-2 border-gray-200">
              Reviews
            </h2>
            <ReviewList reviews={product.reviews} />
          </>
        ) : (
          <p className="text-gray-700 text-sm mt-12">
            This product has no reviews yet,{" "}
            <span>
              {product.hasPurchased
                ? "be the first to review"
                : "review can only be made once you purchase a product, and its status was set to delivered"}
            </span>
          </p>
        )}
      </div>
    )
  }

  if (isLoading) return <Loading />

  if (error || !product) {
    return (
      <div className="mt-20 mx-auto max-w-5xl flex flex-col gap-6">
        <div className="text-center text-red-500">something went wrong</div>
      </div>
    )
  }

  return (
    <div className="mt-20 mx-auto max-w-5xl flex flex-col gap-6">
      <div className="flex w-full gap-6 flex-col md:flex-row">
        {renderImage()}
        {renderInfo()}
      </div>
      <TagList
        tags={product?.tags}
        className="col-span-2 mt-24"
      />
      {renderComments()}
    </div>
  )
}

export default Product
