import { create } from "zustand"

const useModalStore = create((set) => ({
  openedModal: null,

  onClose: () => {},
  openModal: (modalType) => set({ openedModal: modalType }),
  closeModal: () => set({ openedModal: null }),
  setOnClose: (onCloseFn) => set({ onClose: onCloseFn }),
}))

export default useModalStore
