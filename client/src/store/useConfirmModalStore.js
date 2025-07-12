import { create } from "zustand"

const useConfirmModalStore = create((set) => ({
  isOpen: false,
  message: null,
  confirmText: "Confirm",
  cancelText: "Cancel",
  type: "default",
  onConfirm: null,

  setIsOpen: (isOpen) =>
    set({
      isOpen: isOpen,
    }),
  closeModal: () => set({ isOpen: false, onConfirm: null }),
  createConfirmationPanel: (
    message,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default"
  ) =>
    set({
      isOpen: true,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
    }),
}))

export default useConfirmModalStore
