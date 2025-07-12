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
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
)

export default useAuthStore
