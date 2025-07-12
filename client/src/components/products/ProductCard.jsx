import { Link, useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"

import { useRef, useCallback } from "react"

import { createQuery } from "../../pages/ProductDetails.page"

import XMark from "../../assets/icons/xmark.svg?react"
import Pen from "../../assets/icons/pen.svg?react"
import CartIcon from "../../assets/icons/cart.svg?react"
import HeartIcon from "../../assets/icons/heart.svg?react"

import Button from "../common/Button"

const ProductCard = ({
  data,
  userRole,
  isInCart,
  canAddToCart,
  addToCart,
  removeFromCart,
  isWishlisted,
  addToWishlist,
  removeFromWishlist,
  deleteItem,
}) => {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const prefetchTimerRef = useRef(null)

  // prefetches product data using createQuery for consistent query key and function
  const handlePrefetch = useCallback(() => {
    queryClient.prefetchQuery(createQuery(data.id))
  }, [queryClient, data.id])

  const handleMouseEnter = useCallback(() => {
    prefetchTimerRef.current = setTimeout(() => {
      handlePrefetch()
    }, 200)
  }, [handlePrefetch])

  const handleMouseLeave = useCallback(() => {
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current)
      prefetchTimerRef.current = null
    }
  }, [])

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

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromWishlist()
  }

  const renderCardButtons = () => {
    const renderAdminButtons = () => {
      return (
        <>
          <Button
            onClick={handleEdit}
            variant="empty"
            tooltip="edit product"
            className="cursor-default w-8 h-7 grid place-content-center"
          >
            <Pen className="icon h-4 w-4 transition-smooth text-blue-500 group-hover:text-blue-500" />
          </Button>
          <Button
            onClick={handleDelist}
            variant="empty"
            tooltip="delist product"
            className="cursor-default w-8 h-7 grid place-content-center "
          >
            <XMark className="icon h-4 w-4 text-red hover:text-red/80" />
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
              tooltip="remove from cart"
              tooltipPosition="top"
              variant="empty"
              className="w-fit text-sm py-1.5 px-2 group"
            >
              <CartIcon className="icon transition-smooth text-blue-400 group-hover:text-blue-500/70 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]" />
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              tooltip={canAddToCart ? "add to cart" : "out of stock"}
              tooltipPosition="top"
              variant="empty"
              className="w-fit text-sm py-1.5 px-2"
            >
              <CartIcon className="icon transition-smooth text-gray-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
            </Button>
          )}
          {isWishlisted ? (
            <Button
              onClick={handleRemoveFromWishlist}
              tooltip={"remove from wishlist"}
              tooltipPosition="top"
              variant="empty"
              className="w-fit text-sm py-1.5 px-2 group"
            >
              <HeartIcon className="icon transition-smooth text-red-400 group-hover:text-red-400/70 drop-shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
            </Button>
          ) : (
            <Button
              onClick={handleAddToWishlist}
              tooltip={"add to wishlist"}
              tooltipPosition="top"
              variant="empty"
              className="w-fit text-sm py-1.5 px-2"
            >
              <HeartIcon className="icon transition-smooth text-gray-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.8)]" />
            </Button>
          )}
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-2 relative rounded-lg border-background hover:border-gray-200 hover:shadow-sm px-2 pt-2 transition-all duration-100 ease-in-out group flex flex-col justify-between aspect-[9/10]"
    >
      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex flex-row gap-1">
        {renderCardButtons()}
      </div>
      <img
        src={data.images?.[0]?.imageURL ? data.images[0].imageURL : "/images/noImage.png"}
        className="w-full h-full object-contain rounded"
      />
      <p className="text-sm -mb-2 pl-1">
        {data.price}
        <span className="ml-0.5">$</span>
      </p>
      <h3 className="px-1 pb-1 mt-3 line-clamp-3 leading-5 h-18 text-sm last:whitespace-pre-wrap break-keep !overflow-x-hidden">
        {data.name}
      </h3>
    </Link>
  )
}

export default ProductCard
