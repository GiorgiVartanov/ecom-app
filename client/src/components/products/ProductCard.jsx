import { useRef } from "react"
import { Link, useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

import useConfirmModalStore from "../../store/useConfirmModalStore"
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

  const { createConfirmationPanel } = useConfirmModalStore()

  const queryClient = useQueryClient()

  const prefetchTimerRef = useRef(null)

  // prefetches product data using createQuery for consistent query key and function
  const handlePrefetch = () => {
    queryClient.prefetchQuery(createQuery(data.id))
  }

  const handleMouseEnter = () => {
    prefetchTimerRef.current = setTimeout(() => {
      handlePrefetch()
    }, 200)
  }

  const handleMouseLeave = () => {
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current)
      prefetchTimerRef.current = null
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    navigate(`/dashboard/products/edit/${data.id}`)
  }

  const handleDelist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    createConfirmationPanel(
      "Are you sure you want to **delist** this product? (you can re-list it later) (not yet though)",
      () => deleteItem(),
      "Delist",
      "Cancel",
      "danger"
    )
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart()
    toast.success(`successfully added ${data.name} to cart`)
  }

  const handleRemoveFromCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromCart()
    toast.success(`successfully removed ${data.name} from cart`)
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    addToWishlist()
    toast.success(`successfully added ${data.name} to wishlist`)
  }

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromWishlist()
    toast.success(`successfully removed ${data.name} from wishlist`)
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

  const { images, name, price } = data

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
        src={images?.[0]?.imageURL ? images[0].imageURL : "/images/noImage.webp"}
        className="w-full h-full object-contain rounded"
      />
      <p className="text-sm -mb-2 pl-1">
        {price}
        <span className="ml-0.5">$</span>
      </p>
      <h3 className="px-1 pb-1 mt-3 line-clamp-3 leading-5 h-18 text-sm last:whitespace-pre-wrap break-keep !overflow-x-hidden">
        {name}
      </h3>
    </Link>
  )
}

export default ProductCard
