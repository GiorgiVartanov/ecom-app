import { useMutation, useQueryClient } from "@tanstack/react-query"

import { delistProduct } from "../../api/products.api"
import { addItemToCart, removeItemFromCart } from "../../api/cart.api"
import useAuthStore from "../../store/useAuthStore"

import ProductCard from "./ProductCard"

const ProductGrid = ({ data, singleRow, title }) => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id) => delistProduct(id, token),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["products"])
      const previous = queryClient.getQueryData(["products"])
      // optimistically removes delisted product from the cache

      queryClient.setQueryData(["products"], (prev) => prev?.filter((product) => product.id !== id))

      return { previous }
    },
    onError: (error, id, context) => {
      // rolls back cache after error
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], refetchType: "all" })
    },
  })

  const addItemToCartMutation = useMutation({
    mutationFn: (id) => addItemToCart(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["product", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["cart", user])
    },
  })

  const removeItemFromCartMutation = useMutation({
    mutationFn: (id) => removeItemFromCart(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["product", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["cart", user])
    },
  })

  return (
    <div className="grid max-w-6xl mx-auto grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          data={product}
          userRole={user?.role}
          canAddToCart={product.stock > 0}
          isInCart={product.isInCart}
          addToCart={() => {
            addItemToCartMutation.mutate(product.id)
          }}
          removeFromCart={() => {
            removeItemFromCartMutation.mutate(product.id)
          }}
          deleteItem={() => {
            deleteMutation.mutate(product.id)
          }}
        />
      ))}
    </div>
  )
}
export default ProductGrid
