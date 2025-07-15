import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAdminStore = create(
  persist(
    (set) => ({
      tags: [],

      setTags: (tags) => set({ tags }),
    }),
    {
      name: "admin-storage",
      getStorage: () => localStorage,
    }
  )
)

export default useAdminStore
