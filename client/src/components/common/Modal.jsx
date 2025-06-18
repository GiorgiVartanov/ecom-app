import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

const Modal = ({ title, isOpen, onClose, children, className }) => {
  const modalRef = useRef(null)

  const location = useLocation()

  useOnClickOutside(modalRef, onClose)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      // cleanup in case component unmounts while open
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  // closing modal on route change
  useEffect(() => {
    console.log("closing")

    onClose()

    if (isOpen) {
      onClose()
    }
  }, [location.pathname])

  if (!isOpen) return

  return (
    <div className="bg-foreground/30 h-screen w-screen absolute top-0 left-0 z-50 flex items-center justify-center appear">
      <div
        ref={modalRef}
        className={`w-full mb-32 max-w-[420px] h-fit min-h-[240px] bg-background shadow-md overflow-x-hidden rounded-sm ${className}`}
      >
        {title ? <h2 className="text-lg font-semibold ml-3 text-gray-600">{title}</h2> : ""}
        <div className="overflow-auto flex flex-col h-full">{children}</div>
      </div>
    </div>
  )
}

export default Modal
