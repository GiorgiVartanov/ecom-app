import { useState, useEffect, useRef } from "react"
import { Link } from "react-router"

import useModalStore from "../../store/useModalStore"
import useConfirmModalStore from "../../store/useConfirmModalStore"

import CartItem from "./CartItem"

const CartItemList = ({ cartItemList, editItems, isEditable = true }) => {
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const scrollRef = useRef(null)

  const onClose = useModalStore((state) => state.onClose)
  const { createConfirmationPanel } = useConfirmModalStore()

  const handleQuantityIncrease = (e, itemId, quantity, stock) => {
    e.preventDefault()
    e.stopPropagation()

    if (quantity + 1 > stock) return

    editItems({ id: itemId, newQuantity: quantity + 1 })
  }

  const handleQuantityDecrease = (e, itemId, quantity) => {
    e.preventDefault()
    e.stopPropagation()

    if (quantity === 1) {
      // shows confirmation dialog when trying to remove the last item
      createConfirmationPanel(
        "Are you sure you want to remove this item from your cart?",
        () => editItems({ id: itemId, newQuantity: 0 }),
        "Remove",
        "Keep",
        "danger"
      )
      return
    }

    editItems({ id: itemId, newQuantity: quantity - 1 })
  }

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const updateShadows = () => {
      const { scrollTop, scrollHeight, clientHeight } = element

      const scrollable = scrollHeight > clientHeight

      setIsScrollable(scrollable)
      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }

    element.addEventListener("scroll", updateShadows)
    updateShadows()

    return () => {
      element.removeEventListener("scroll", updateShadows)
    }
  }, [cartItemList])

  return (
    <div className="relative flex-1">
      <div
        className={`
        absolute top-0 left-0 right-0 h-4
        bg-gradient-to-b from-black/7.5
        pointer-events-none z-10
        transition-opacity duration-200 ease-in-out
        ${showTopShadow ? "opacity-100" : "opacity-0"}
      `}
      />
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-4
        bg-gradient-to-t from-black/7.5
        pointer-events-none z-10
        transition-opacity duration-200 ease-in-out
        ${showBottomShadow ? "opacity-100" : "opacity-0"}
      `}
      />
      <div
        ref={scrollRef}
        className={`overflow-y-auto max-h-[600px] flex flex-col gap-4 p-1 ${
          isScrollable ? "pr-4" : ""
        }`}
      >
        {cartItemList?.length > 0 ? (
          cartItemList.map((cartItem) => (
            <CartItem
              key={cartItem.id}
              quantity={cartItem.quantity}
              product={cartItem.product}
              onClick={onClose}
              onQuantityIncrease={(e) =>
                handleQuantityIncrease(e, cartItem.id, cartItem.quantity, cartItem.stock)
              }
              onQuantityDecrease={(e) => handleQuantityDecrease(e, cartItem.id, cartItem.quantity)}
              isEditable={isEditable}
              className="last-of-type:border-b-0"
            />
          ))
        ) : (
          <div className="w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/search"
              onClick={onClose}
              className="link mt-auto pb-0 ml-2"
            >
              Your cart is empty. <span className="text-link">Browse shop</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItemList
