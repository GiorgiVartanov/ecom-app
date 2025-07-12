import { Link } from "react-router"
import { useQueryClient } from "@tanstack/react-query"

import { getProduct } from "../../api/products.api"
import useModalStore from "../../store/useModalStore"

import Button from "../common/Button"

const CartItem = ({
  product,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  isEditable = false,
  className,
}) => {
  const { id: productId, images, name, price, description, stock } = product

  const onClose = useModalStore((state) => state.onClose)

  const queryClient = useQueryClient()

  const handlePrefetch = (productId) => {
    queryClient.prefetchQuery({
      queryKey: ["product", productId],
      queryFn: () => getProduct(productId),
    })
  }

  const renderImage = () => {
    return (
      <Link
        to={`/product/${productId}`}
        onClick={onClose}
        onMouseEnter={() => handlePrefetch(productId)}
        className="aspect-square bg-white h-72 my-2 flex flex-col place-content-center shadow py-3 px-15 overflow-hidden rounded-lg"
      >
        <img
          src={images?.[0]?.imageURL || "/images/noImage.png"}
          alt=""
          className="object-contain max-w-full max-h-full block"
        />
      </Link>
    )
  }

  const renderDescription = () => {
    return (
      <div className="flex-6/10 flex flex-col gap-2">
        <Link
          to={`/product/${productId}`}
          onClick={onClose}
          onMouseEnter={() => handlePrefetch(productId)}
          className="text-wrap text-sm px-1 pb-1 line-clamp-2 leading-6 font-semibold mt-0.5"
        >
          {name}
        </Link>
        <Link
          to={`/product/${productId}`}
          onClick={onClose}
          onMouseEnter={() => handlePrefetch(productId)}
          className="text-wrap text-sm px-1 pb-1 line-clamp-4 leading-6"
        >
          {description}
        </Link>
        <div className="flex flex-col p-1 mb-1 mt-auto">
          <div className="justify-between w-full">
            {price}
            <span className="ml-0.5 mb-0.5">$</span>
          </div>
          {renderButtons()}
        </div>
      </div>
    )
  }

  const renderButtons = () => {
    if (!isEditable) return

    return (
      <div className="mt-auto">
        <p>quantity</p>
        <div className="flex gap-3 mt-1 items-center">
          <Button
            onClick={onQuantityDecrease}
            className="text-xl py-0 px-2 font-normal"
          >
            -
          </Button>
          <p className="font-semibold">{quantity}</p>
          <Button
            onClick={onQuantityIncrease}
            className="text-xl py-0 px-2 font-normal disabled:cursor-default"
            disabled={quantity + 1 > stock}
          >
            +
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex sm:flex-row flex-col gap-4 p-3 border-b-2 border-gray-400/10 text-sm ${className}`}
    >
      {renderImage()}
      {renderDescription()}
    </div>
  )
}
export default CartItem
