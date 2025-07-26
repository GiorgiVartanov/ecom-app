import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

import { getCart, editCartItem } from "../../api/cart.api"
import useAuthStore from "../../store/useAuthStore"

import Modal from "../common/Modal"
import CartItemList from "./CartItemList"

const CartModal = ({ title, isOpen, onClose, className }) => {
  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const queryClient = useQueryClient()

  const {
    data: itemList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCart(token),
    enabled: !!user?.id,
  })

  const editCartItemMutation = useMutation({
    mutationFn: ({ id, newQuantity }) => editCartItem(id, { quantity: newQuantity }, token),
    onMutate: async ({ id, newQuantity }) => {
      await queryClient.cancelQueries(["cart", user.id])

      const previousCart = queryClient.getQueryData(["cart", user.id])

      queryClient.setQueryData(["cart", user.id], (prev) =>
        prev
          ?.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
          .filter((item) => item.quantity > 0)
      )

      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", user.id], context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  if (!user || !token) return

  if (isLoading) return

  if (error) return

  return (
    <Modal
      title={title || "Your Cart"}
      isOpen={isOpen}
      onClose={onClose}
      modalId="cart-modal"
      className={`max-w-[920px] flex flex-col gap-2 p-2 ${className}`}
    >
      <CartItemList
        cartItemList={itemList}
        editItems={editCartItemMutation.mutate}
      />
      <div className="flex flex-col-reverse xs:flex-row gap-1.5 xs:gap-4 align-bottom pt-2">
        <Link
          to="/checkout"
          className="button-primary px-12 text-center"
          onClick={onClose}
        >
          Go to checkout
        </Link>

        <div className="mt-auto text-sm">
          total:{" "}
          <span className="font-semibold">
            {itemList
              ?.reduce(
                (accumulator, product) =>
                  accumulator + Number(product?.product?.price) * Number(product?.quantity),
                0
              )
              .toFixed(2)}
            <span className="ml-0.5 font-semibold">$</span>
          </span>
        </div>
        <Link
          to="/search"
          className="text-link text-sm mt-auto pb-0 ml-2 hidden sm:block"
          onClick={onClose}
        >
          Continue shopping
        </Link>
      </div>
    </Modal>
  )
}

export default CartModal
