import { Link, useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"

import { getProduct } from "../../api/products.api"

import XMark from "../../assets/icons/xmark.svg?react"
import Pen from "../../assets/icons/pen.svg?react"

import Button from "../common/Button"

const ProductCard = ({
  data,
  userRole,
  isInCart,
  canAddToCart,
  addToCart,
  removeFromCart,
  addToWishlist,
  deleteItem,
}) => {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["product", data.id],
      queryFn: () => getProduct(data.id),
    })
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    navigate(`/dashboard/products/edit/${data.id}`)
  }

  const handleDelist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    deleteItem()
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart()
  }

  const handleRemoveFromCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromCart()
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToWishlist()
  }

  const renderCardButtons = () => {
    const renderAdminButtons = () => {
      return (
        <>
          <Button
            onClick={handleEdit}
            className="cursor-default w-10 h-9 grid place-content-center bg-blue-500 hover:bg-blue-500/80"
          >
            <Pen className="icon h-4 w-4" />
          </Button>
          <Button
            onClick={handleDelist}
            className="cursor-default w-10 h-9 grid place-content-center bg-red hover:bg-red/80"
          >
            <XMark className="icon h-4 w-4" />
          </Button>
        </>
      )
    }

    const renderUserButtons = () => {
      return (
        <>
          {isInCart ? (
            <Button
              onClick={handleRemoveFromCart}
              className="w-fit text-sm ml-auto py-0.5 px-1.5 gradient-bg"
            >
              Remove From Cart
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-fit text-sm ml-auto py-0.5 px-1.5 gradient-bg"
              disabled={!canAddToCart}
            >
              Add To Cart
            </Button>
          )}
          <Button
            onClick={handleAddToWishlist}
            className="w-fit text-sm ml-auto py-0.5 px-1.5 gradient-bg"
          >
            Add To Wishlist
          </Button>
        </>
      )
    }

    const renderGuestButtons = () => {
      return <></>
    }

    switch (userRole) {
      case "ADMIN":
        return renderAdminButtons()
      case "USER":
        return renderUserButtons()
      default:
        return renderGuestButtons()
    }
  }

  return (
    <Link
      to={`/product/${data.id}`}
      onMouseEnter={handlePrefetch}
      className="border-2 relative rounded-sm border-background hover:border-gray-200 hover:shadow-sm px-2 pt-2 transition-all duration-100 ease-in-out group flex flex-col justify-between aspect-[9/10]"
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex flex-col gap-2">
        {renderCardButtons()}
      </div>
      <img
        src={data.images?.[0]?.imageURL ? data.images[0].imageURL : "/images/noImage.png"}
        className="w-full h-full object-contain rounded-sm"
      />
      <p className="text-sm font-semibold -mb-2 pl-1">
        {data.price}
        <span className="ml-0.5">$</span>
      </p>
      <h3 className="px-1 pb-1 mt-3 line-clamp-3 h-18 text-sm leading-6 last:whitespace-pre-wrap break-keep !overflow-x-hidden">
        {data.name}
      </h3>
    </Link>
  )
}

export default ProductCard
