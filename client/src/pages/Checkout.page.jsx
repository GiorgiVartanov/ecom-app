import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router"

import { getCart, editCartItem } from "../api/cart.api"
import { createOrder } from "../api/orders.api"
import { createQuery } from "../pages/Search.page"
import useAuthStore from "../store/useAuthStore"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import CartItem from "../components/cart/CartItem"
import Button from "../components/common/Button"
import Loading from "../components/common/Loading"

const Checkout = () => {
  useDocumentTitle("Checkout - PcPal")

  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const navigate = useNavigate()

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

  const handlePrefetch = () => {
    const filters = { query: "" }
    const { queryKey, queryFn } = createQuery(filters, token)

    queryClient.prefetchQuery({ queryKey, queryFn })
  }

  const orderMutation = useMutation({
    mutationFn: () =>
      createOrder(
        cartItemList.map((cartItem) => ({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
        })),
        token
      ),
    onMutate: async () => {
      const previousOrders = queryClient.getQueryData(["orders", user.id])

      await queryClient.cancelQueries(["cart", user.id])
      await queryClient.cancelQueries(["orders", user.id])

      return { previousCart: cartItemList, previousOrders: previousOrders }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", user.id], context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart", user.id])
    },
    onSuccess: () => {
      navigate("/checkout", { replace: true })
    },
  })

  const editCartItemMutation = useMutation({
    mutationFn: ({ id, newQuantity }) => editCartItem(id, { quantity: newQuantity }, token),
    onMutate: async ({ id, newQuantity }) => {
      await queryClient.cancelQueries(["cart", user.id])

      const previousCart = queryClient.getQueryData(["cart", user.id])

      // optimistic update, sets new quantity or removes item if zero
      queryClient.setQueryData(["cart", user.id], (prev) =>
        prev
          ?.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
          .filter((item) => item.quantity > 0)
      )

      // context for potential rollback
      return { previousCart }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", user.id], context.previousCart)
      }
    },
    onSettled: () => {
      // refetch cart to ensure data consistency
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  if (isLoading) return <Loading />

  if (error) return <div>Something went wrong</div>

  const renderPaySection = () => {
    if (cartItemList?.length <= 0) return

    return (
      <div className="text-sm p-3 flex flex-col">
        total:
        <span className="font-semibold">
          {cartItemList
            ?.reduce((accumulator, product) => {
              return accumulator + Number(product?.product?.price) * Number(product?.quantity)
            }, 0)
            .toFixed(2)}
          <span className="ml-0.5 font-semibold">$</span>
        </span>
        <Button
          onClick={orderMutation.mutate}
          className="mt-2 bg-primary-gradient whitespace-nowrap"
          variant="primary"
        >
          Order Now
        </Button>
      </div>
    )
  }

  const renderCartItemList = () => {
    if (cartItemList?.length > 0) {
      return cartItemList.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          id={cartItem.id}
          quantity={cartItem.quantity}
          product={cartItem.product}
          editCartItemMutation={editCartItemMutation.mutate}
        />
      ))
    }
  }

  const renderEmptyCartItemList = () => {
    return (
      <div className="h-full w-full place-content-center grid min-h-[calc(100vh-8rem)]">
        <div className="mb-28">
          <h2 className="text-3xl">Your cart is empty</h2>
          <Link
            to="/search?query="
            onMouseEnter={handlePrefetch}
            className="text-2xl font-semibold mt-2 link hover:text-primary text-center"
          >
            Browse shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto mt-2">
      <h2 className="text-lg mb-4 font-semibold text-gray-700">checkout</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {renderPaySection()}
        {cartItemList?.length > 0 ? renderCartItemList() : renderEmptyCartItemList()}
      </div>
    </div>
  )
}

export default Checkout
