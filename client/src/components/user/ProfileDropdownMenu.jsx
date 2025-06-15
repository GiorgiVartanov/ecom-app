import { useState, useRef, cloneElement, Children } from "react"
import { Link } from "react-router"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

import Button from "../common/Button"

const ProfileDropdownMenu = ({ children }) => {
  const ref = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => {
    setIsMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  const handleProfileClick = () => {
    if (isMenuOpen) {
      handleCloseMenu()
    } else {
      handleOpenMenu()
    }
  }

  const styledChildren = Children.map(children, (child) =>
    cloneElement(child, {
      className: "link text-right w-full py-3 w-full hover:bg-gray-100 hover:brightness-100",
    })
  )

  useOnClickOutside(ref, handleCloseMenu)

  return (
    <div
      ref={ref}
      className="flex align-center relative z-100"
    >
      <button
        onClick={handleProfileClick}
        className="cursor-pointer flex flex-row items-center"
      >
        Menu
        <div
          className={`transition-transform duration-200 ease-in-out ml-1 ${
            isMenuOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </div>
        {/* <div className="h-6 w-6 rounded-xl bg-primary text-background font-bold ml-1">
          {username[0]}
        </div> */}
      </button>
      <div
        className={`absolute bg-background fade-in-top mt-13 min-w-28 right-0 shadow-sm flex flex-col gap-1 rounded-sm ${
          isMenuOpen ? "visible" : "hidden"
        } `}
      >
        {styledChildren}
      </div>
    </div>
  )
}

export default ProfileDropdownMenu
