import { useLayoutEffect, useRef } from "react"
// import { useLocation } from "react-router"

import { ModalContext } from "../../context/ModalContext"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

const Modal = ({ title, isOpen, onClose, children, className }) => {
  const modalRef = useRef(null)

  useOnClickOutside(modalRef, onClose)

  // blocks scrolling when modal is open
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

  if (!isOpen) return

  return (
    <div className="bg-foreground/45 h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-center appear px-2">
      <div
        ref={modalRef}
        className={`w-full mb-32 max-w-[420px] h-fit min-h-[240px] bg-background shadow-md rounded relative ${className}`}
      >
        <p className="text-gray-800 text-sm font-bold opacity-50 text-center absolute -bottom-6.5 left-0 w-full">
          click outside to close
        </p>
        <div className="flex flex-col h-full flex-1 justify-between">
          <ModalContext.Provider value={{ onClose }}>{children}</ModalContext.Provider>
        </div>
        {title ? (
          <div className="bg-white absolute -top-7 left-0 pb-4 px-3 pt-1 rounded">
            <h2 className="text-lg font-semibold ml-0.5 text-gray-600 z-50 text-primary-gradient">
              {title}
            </h2>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}

export default Modal
