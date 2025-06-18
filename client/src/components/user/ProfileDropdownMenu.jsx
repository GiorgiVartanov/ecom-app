import { useRef, cloneElement, Children } from "react"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

const ProfileDropdownMenu = ({ isOpen, openMenu, onClose, children }) => {
  const ref = useRef(null)

  const handleProfileClick = () => {
    if (isOpen) {
      onClose()
    } else {
      openMenu()
    }
  }

  const styledChildren = Children.map(children, (child) =>
    cloneElement(child, {
      className: "link text-right w-full py-3 w-full hover:bg-gray-100 hover:brightness-100",
    })
  )

  useOnClickOutside(ref, onClose)

  return (
    <div
      ref={ref}
      className="flex align-center relative z-100"
    >
      <button
        onClick={handleProfileClick}
        className="link cursor-pointer flex flex-row items-center"
      >
        Menu
        <div
          className={`transition-transform duration-200 ease-in-out ml-1 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </div>
      </button>
      <div
        className={`absolute bg-background fade-in-top mt-15 min-w-28 right-0 shadow-sm flex flex-col gap-1 rounded-sm ${
          isOpen ? "visible" : "hidden"
        } `}
      >
        {styledChildren}
      </div>
    </div>
  )
}

export default ProfileDropdownMenu
