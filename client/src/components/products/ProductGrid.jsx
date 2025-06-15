import { useMutation, useQueryClient } from "@tanstack/react-query"

import { delistProduct } from "../../api/products.api"
import useAuthStore from "../../store/useAuthStore"

import ProductCard from "./ProductCard"

const ProductGrid = ({ data, singleRow, title }) => {
  const userRole = useAuthStore((state) => state.user.role)
  const token = useAuthStore((state) => state.token)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id) => delistProduct(id, token),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["products"])
      const previous = queryClient.getQueryData(["products"])
      // optimistically removes delisted product from the cache

      queryClient.setQueryData(["products"], (old) => old?.filter((p) => p.id !== id))

      return { previous }
    },
    onError: (err, id, context) => {
      // rolls back cache after error
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey.some((k) => typeof k === "string" && k.includes("search")),
        refetchType: "all",
      })
    },
  })

  return (
    <div className="grid max-w-6xl mx-auto grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          data={product}
          isAdmin={userRole === "ADMIN"}
          deleteItem={() => {
            mutation.mutate(product.id)
          }}
        />
      ))}
    </div>
  )
}
export default ProductGrid
