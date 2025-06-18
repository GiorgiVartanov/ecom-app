import { Link } from "react-router"

import Button from "../common/Button"

const CartItem = ({ id, product, quantity, editCartItemMutation }) => {
  const { id: productId, images, name, price, stock } = product

  console.log(product)

  const handleQuantityIncrease = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (quantity + 1 > stock) return

    editCartItemMutation({ id, newQuantity: quantity + 1 })
  }

  const handleQuantityDecrease = (e) => {
    e.preventDefault()
    e.stopPropagation()

    editCartItemMutation({ id, newQuantity: quantity - 1 })
  }

  return (
    <Link
      to={`/product/${productId}`}
      className="flex gap-2 p-3 border-b-2 border-gray-200 text-sm"
    >
      <div className="flex-1/2 h-64 my-2 flex flex-col items-center shadow p-3 overflow-hidden rounded-lg">
        <img
          src={images[0].imageURL}
          alt=""
          className="object-contain block flex-1"
        />
      </div>
      <div className="flex-1/2 flex flex-col gap-2">
        <p className="text-wrap text-sm px-1 pb-1 line-clamp-1 h-12 leading-6">{name}</p>
        <div className="flex flex-col p-1">
          <div className="font-semibold justify-between w-full">
            {price}
            <span className="ml-0.5">$</span>
          </div>
          <div className="mt-auto">
            <p>quantity</p>
            <div className="flex gap-3 mt-1 items-center">
              <Button
                onClick={handleQuantityDecrease}
                className="text-xl py-0 px-2 font-normal gradient-bg"
              >
                -
              </Button>
              <p className="font-semibold">{quantity}</p>
              <Button
                onClick={handleQuantityIncrease}
                className="text-xl py-0 px-2 font-normal disabled:cursor-default gradient-bg"
                disabled={quantity + 1 > stock}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
export default CartItem
