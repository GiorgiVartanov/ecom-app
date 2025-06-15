import { useState } from "react"
import { Link } from "react-router"

import useAuthStore from "../../store/useAuthStore"

import Button from "../common/Button"
import SearchBar from "../common/SearchBar"
import AuthModal from "../user/AuthModal"
import ProfileDropdownMenu from "../user/ProfileDropdownMenu"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  const logOut = useAuthStore((state) => state.logout)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const renderGuestLinks = () => {
    return (
      <>
        <Link
          className="button link"
          to="/search?sortby=popular"
        >
          Popular
        </Link>
        <Link
          className="link"
          to="/search?sortby=sale"
        >
          Sale
        </Link>
        <Button
          onClick={handleOpen}
          className="link"
        >
          Sign Up
        </Button>
      </>
    )
  }

  const renderUserLinks = () => {
    return (
      <>
        <Link
          className="link"
          to="/search?sortby=popular"
        >
          Popular
        </Link>
        <Link
          className="link"
          to="/search?sortby=sale"
        >
          Sale
        </Link>
        <ProfileDropdownMenu
          username={user.name}
          icon={user.icon}
        >
          <Link
            to={`/profile/${user.id}`}
            className="link ml-auto"
          >
            Profile
          </Link>
          <Button
            onClick={handleOpen}
            className="link ml-auto"
          >
            Whish List
          </Button>
          <Button
            onClick={handleOpen}
            className="link ml-auto"
          >
            Cart
          </Button>
          <Button
            onClick={logOut}
            className="link ml-auto"
          >
            Log Out
          </Button>
        </ProfileDropdownMenu>
      </>
    )
  }

  const renderAdminLinks = () => {
    return (
      <>
        <ProfileDropdownMenu
          username={user.name}
          icon={user.icon}
        >
          <Link
            to={`/profile/${user.id}`}
            className="link"
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            className="link"
          >
            Admin
          </Link>
          <Button
            onClick={() => {}}
            className="link"
          >
            Settings
          </Button>
          <Button
            onClick={logOut}
            className="link"
          >
            Log Out
          </Button>
        </ProfileDropdownMenu>
      </>
    )
  }

  const renderLinks = () => {
    switch (user?.role) {
      case "USER":
        return renderUserLinks()
      case "ADMIN":
        return renderAdminLinks()
      default:
        return renderGuestLinks()
    }
  }

  return (
    <header className="flex flex-row items-center justify-between px-2 py-2 border-b-2 border-gray-100 mb-2 text-nowrap">
      <Link
        className="p-2 text-lg transition-colors duration-200 ease-in-out relative group"
        to="/"
      >
        <h1 className="relative z-10 transition-colors duration-200 group-hover:text-background/80">
          Build This Way
        </h1>
        <div className="absolute w-18 h-4 bg-primary z-5 right-0 bottom-2 transform transition-all duration-300 group-hover:translate-x--1.5 group-hover:translate-y--1.5 group-hover:w-36 group-hover:h-7" />
      </Link>
      <SearchBar />
      <nav>
        <ul className="flex flex-row gap-2 px-2">{renderLinks()}</ul>
      </nav>
      <AuthModal
        isOpen={isOpen}
        onClose={handleClose}
      />
    </header>
  )
}

export default Header
