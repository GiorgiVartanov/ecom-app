import { useRef, cloneElement, Children } from "react"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

import Button from "./Button"

// renders dropdown menu used in header
const DropdownMenu = ({ isOpen, openMenu, onClose, closeOnClick = true, children }) => {
  const ref = useRef(null)

  const handleToggle = () => {
    if (isOpen) {
      onClose()
    } else {
      openMenu()
    }
  }

  const styledChildren = Children.map(children, (child) => {
    const extraClasses =
      "link text-center sm:text-right w-full py-5 sm:py-3 w-full hover:bg-gray-100 hover:brightness-100"

    const { className, onClick: childOnClick } = child.props

    let newClassName

    if (typeof className === "function") {
      newClassName = (...args) => {
        const result = className(...args)
        return [result, extraClasses].filter(Boolean).join(" ") // filter(Boolean) removes undefined/empty values
      }
    } else {
      newClassName = [className, extraClasses].filter(Boolean).join(" ")
    }

    // merges onClose with any existing onClick handler
    const mergedOnClick = (...args) => {
      if (typeof childOnClick === "function") {
        childOnClick(...args)
      }
      if (typeof onClose === "function" && closeOnClick) {
        onClose(...args)
      }
    }

    return cloneElement(child, { className: newClassName, onClick: mergedOnClick })
  })

  useOnClickOutside(ref, onClose)

  return (
    <div
      ref={ref}
      className="flex place-items-center relative z-100"
    >
      <Button
        onClick={handleToggle}
        variant="secondary"
        className="link cursor-pointer flex flex-row items-center"
        aria-label="Toggle dropdown menu"
      >
        <div className="flex flex-col gap-1">
          <div
            className={`bg-gray-800 rounded-sm h-1 w-6 transition-smooth ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`bg-gray-800 rounded-sm h-1 w-6 transition-smooth ${
              isOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`bg-gray-800 rounded-sm h-1 w-6 transition-smooth ${
              isOpen ? "rotate-135 -translate-y-2" : ""
            }`}
          ></div>
        </div>
      </Button>
      <div
        className={`absolute top-0 bg-background fade-in-top mt-15 min-w-28 w-[calc(100vw-2rem)] sm:w-auto right-0 shadow-sm flex flex-col gap-1 rounded ${
          isOpen ? "visible" : "hidden"
        } `}
      >
        {styledChildren}
      </div>
    </div>
  )
}

export default DropdownMenu
