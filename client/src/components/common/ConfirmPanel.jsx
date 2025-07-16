import { useRef, useLayoutEffect } from "react"
import ReactMarkdown from "react-markdown"

import useConfirmModalStore from "../../store/useConfirmModalStore"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"

import Button from "./Button"

// renders modal with a message and a confirm and cancel buttons
const ConfirmPanel = () => {
  const { isOpen, message, type, closeModal, confirmText, cancelText, onConfirm } =
    useConfirmModalStore()

  const modalRef = useRef()
  const backgroundRef = useRef()

  useOnClickOutside(modalRef, closeModal, backgroundRef)

  useLayoutEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.classList.add("overflow-hidden")
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }
    } else {
      document.body.classList.remove("overflow-hidden")
      document.body.style.paddingRight = ""
    }

    return () => {
      // cleanup in case component unmounts while open
      document.body.classList.remove("overflow-hidden")
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={backgroundRef}
      className="h-full w-full bg-foreground/45 fixed top-0 left-0 z-50 flex justify-center items-center appear"
    >
      <div
        ref={modalRef}
        id="confirm-modal"
        className={`max-w-md w-full mx-4 bg-white rounded-lg shadow-lg`}
      >
        <div className="p-2 min-h-[120px] h-full flex flex-col justify-between">
          <div className="text-sm text-gray-600 mb-6">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={closeModal}
              variant="secondary"
              className="px-3 py-1 text-sm"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                closeModal()
              }}
              variant={type}
              className="px-3 py-1 text-sm"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPanel
