import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

import { delistProduct } from "../../api/products.api"
import { addItemToCart, removeItemFromCart } from "../../api/cart.api"
import { addItemToWishlist, removeItemFromWishList } from "../../api/wishlist.api"
import useAuthStore from "../../store/useAuthStore"

import ProductCard from "./ProductCard"
import Button from "../common/Button"

// renders a grid of product cards
const ProductGrid = ({ resetFilters, data, className }) => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id) => delistProduct(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["products", id])
    },
  })

  const addItemToCartMutation = useMutation({
    mutationFn: (id) => addItemToCart(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["product", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  const removeItemFromCartMutation = useMutation({
    mutationFn: (id) => removeItemFromCart(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["product", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["cart", user.id])
    },
  })

  const addItemToWishlistMutation = useMutation({
    mutationFn: (id) => addItemToWishlist(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["wishlist", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["wishlist", user.id])
    },
  })

  const removeItemFromWishlistMutation = useMutation({
    mutationFn: (id) => removeItemFromWishList(id, token),
    onSettled: (id) => {
      queryClient.invalidateQueries(["wishlist", id, token ? "logged-in" : "not-logged-in"])
      queryClient.invalidateQueries(["wishlist", user.id])
    },
  })

  return (
    <>
      {data?.length > 0 ? (
        <div
          className={`grid w-full max-w-6xl mx-auto grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-x-hidden ${className}`}
        >
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
              isWishlisted={product.isWishlisted}
              addToWishlist={() => {
                addItemToWishlistMutation.mutate(product.id)
              }}
              removeFromWishlist={() => {
                removeItemFromWishlistMutation.mutate(product.id)
              }}
              deleteItem={() => {
                deleteMutation.mutate(product.id)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid place-content-center w-full min-h-[calc(100vh-16rem)]">
          <div className="w-fit">
            there are no products for your filters,{" "}
            <Button
              onClick={resetFilters}
              variant="text"
            >
              reset filters
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductGrid
