import { useRef } from "react"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

const Modal = ({ title, isOpen, onClose, children, className }) => {
  const modalRef = useRef(null)

  useOnClickOutside(modalRef, onClose)

  if (!isOpen) return

  return (
    <div className="bg-foreground/30 h-screen w-screen absolute top-0 left-0 z-50 flex items-center justify-center appear">
      <div
        ref={modalRef}
        className={`w-full mb-32 max-w-[420px] h-fit bg-background shadow-md rounded-sm ${className}`}
      >
        {title ? <h2 className="text-xl font-semibold mb-4">{title}</h2> : ""}
        <div className="overflow-auto flex flex-col h-full">{children}</div>
      </div>
    </div>
  )
}

export default Modal
