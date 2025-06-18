import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: ({ user, token }) =>
        set({
          user,
          token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        }),

      // optimistically updates cart
      optimisticallyAddItemToCart: (item) =>
        set((state) => ({
          cartItems: [...state.cartItems, item],
        })),

      // changes optimistically added item to the new item from cart
      confirmAddItemToCart: (newItem) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) => (i.tempId === newItem.tempId ? newItem : i)),
        })),

      // removes item locally
      removeItemFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        })),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
)

export default useAuthStore
