import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

import { getCart, editCartItem } from "../../api/cart.api"
import useAuthStore from "../../store/useAuthStore"

import Modal from "../common/Modal"
import CartItem from "../cart/CartItem"
import Button from "../common/Button"

const CartModal = ({ title, isOpen, onClose, className }) => {
  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const queryClient = useQueryClient()

  const {
    data: cartItemList,
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

      // optimistic update, sets new quantity or removes item if zero
      queryClient.setQueryData(["cart", user.id], (old) =>
        old
          ?.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
          .filter((item) => item.quantity > 0)
      )

      // context for potential rollback
      return { previousCart }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", user.id], context.previousCart)
      }
    },

    onSettled: () => {
      // refetch cart to ensure data consistency
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>something went wrong</div>

  return (
    <Modal
      title={title || "Your Cart"}
      isOpen={isOpen}
      onClose={onClose}
      className={`max-w-[920px] max-h-[780px] flex flex-col gap-4 p-2 ${className}`}
    >
      {cartItemList?.length > 0 ? (
        cartItemList.map((cartItem) => (
          <CartItem
            key={cartItem.id}
            id={cartItem.id}
            quantity={cartItem.quantity}
            product={cartItem.product}
            editCartItemMutation={editCartItemMutation.mutate}
          />
        ))
      ) : (
        <div className="h-32 w-full grid place-content-center">
          <Link
            to="/search"
            className="link mt-auto pb-0 ml-2"
          >
            Your cart is empty
          </Link>
        </div>
      )}
      <div className="mt-12 flex gap-4 align-bottom">
        <Button className="px-12 gradient-bg">Order</Button>

        <div className="mt-auto text-sm">
          total:{" "}
          <span className="font-semibold">
            {cartItemList
              ?.reduce((accumulator, product) => {
                return accumulator + Number(product?.product?.price)
              }, 0)
              .toFixed(2)}
            <span className="ml-0.5 font-semibold">$</span>
          </span>
        </div>
        <Link
          to="/search"
          className="link text-sm mt-auto pb-0 ml-2"
        >
          Continue shopping
        </Link>
      </div>
    </Modal>
  )
}

export default CartModal
