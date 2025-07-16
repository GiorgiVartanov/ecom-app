import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import useAuthStore from "../../store/useAuthStore"
import useModalStore from "../../store/useModalStore"
import useConfirmModalStore from "../../store/useConfirmModalStore"
import { getCart } from "../../api/cart.api"
import { createQuery } from "../../pages/Search.page"

import CartIcon from "../../assets/icons/cart.svg?react"

import Button from "../common/Button"
import AuthModal from "../user/AuthModal"
import DropdownMenu from "../common/DropdownMenu"
import CartModal from "../cart/CartModal"
import WishListModal from "../cart/WishlistModal"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logOut = useAuthStore((state) => state.logout)

  const openedModal = useModalStore((state) => state.openedModal)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)

  const createConfirmationPanel = useConfirmModalStore((state) => state.createConfirmationPanel)

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { data: cartItemList } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCart(token),
    enabled: !!user?.id,
  })

  const handlePrefetchEverything = () => {
    const filters = { query: "" }
    const { queryKey, queryFn } = createQuery(filters, token)

    queryClient.prefetchQuery({ queryKey, queryFn })
  }

  const handleLogout = () => {
    createConfirmationPanel(
      "Are you sure you want to log out?",
      () => {
        logOut()
        navigate("/")
        setIsMenuOpen(false)
      },
      "Log Out",
      "Cancel",
      "danger"
    )
  }

  const handleOpenDropdownMenu = () => {
    setIsMenuOpen(true)
  }

  const handleCloseDropdownMenu = () => {
    setIsMenuOpen(false)
  }

  const handleModalClose = () => {
    closeModal()
  }

  const handleAuthModalOpen = () => {
    setIsMenuOpen(false)
    openModal("auth")
  }

  const handleCartModalOpen = () => {
    setIsMenuOpen(false)
    openModal("cart")
  }

  const handleWishlistModalOpen = () => {
    setIsMenuOpen(false)
    openModal("wishlist")
  }

  const renderGuestLinks = () => {
    return (
      <>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search?query="
            onMouseEnter={handlePrefetchEverything}
            className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
          >
            Search
          </NavLink>
        </li>
        <li>
          <Button
            onClick={handleAuthModalOpen}
            className="link button"
            variant="empty"
          >
            Sign In
          </Button>
        </li>
      </>
    )
  }

  const renderUserLinks = () => {
    return (
      <>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <Button
            onClick={handleCartModalOpen}
            className="link ml-auto relative"
          >
            <CartIcon className="icon" />
            <span className="absolute font-bold bg-foreground text-background text-xs rounded-full w-4 h-4 right-1.5 bottom-1.5 drop-shadow-[0_0_3px_rgba(255,255,255,1)]">
              {cartItemList?.length}
            </span>
          </Button>
        </li>
        <li>
          <DropdownMenu
            username={user.name}
            icon={user.icon}
            openMenu={handleOpenDropdownMenu}
            onClose={handleCloseDropdownMenu}
            isOpen={isMenuOpen}
          >
            <NavLink
              to="/search?query="
              onMouseEnter={handlePrefetchEverything}
              className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
            >
              Search
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => `link ${isActive ? "text-primary" : ""}`}
            >
              Orders
            </NavLink>
            <Button
              onClick={handleWishlistModalOpen}
              variant="secondary"
              className="link ml-auto"
            >
              Whish List
            </Button>
            <Button
              onClick={handleLogout}
              className="link hover:text-red-500"
            >
              Log Out
            </Button>
          </DropdownMenu>
        </li>
      </>
    )
  }

  const renderAdminLinks = () => {
    return (
      <>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            onMouseEnter={handlePrefetchEverything}
            className={({ isActive }) => `link button ${isActive ? "text-primary" : ""}`}
          >
            Search
          </NavLink>
        </li>
        <li>
          <DropdownMenu
            username={user.name}
            icon={user.icon}
            openMenu={handleOpenDropdownMenu}
            onClose={handleCloseDropdownMenu}
            isOpen={isMenuOpen}
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `link ${isActive ? "text-primary" : ""}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => `link ${isActive ? "text-primary" : ""}`}
            >
              Orders
            </NavLink>
            <Button
              onClick={handleCartModalOpen}
              className="link ml-auto"
            >
              Cart
            </Button>
            <Button
              onClick={handleWishlistModalOpen}
              className="link ml-auto"
            >
              Whish List
            </Button>
            <Button
              onClick={handleLogout}
              className="link hover:text-red-500"
            >
              Log Out
            </Button>
          </DropdownMenu>
        </li>
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

  const renderTitle = () => {
    return (
      <NavLink
        to="/"
        end
      >
        {({ isActive }) => (
          <div className="p-2 text-lg transition-colors duration-200 ease-in-out relative group">
            <h1
              className={`relative z-10 transition-colors duration-200 ${
                isActive ? "text-background/80" : ""
              } group-hover:text-background/80`}
            >
              <span
                className={`bg-primary-gradient font-bold bg-clip-text text-transparent transition-colors duration-300 ease-in-out ${
                  isActive ? "text-black!" : ""
                } group-hover:text-black`}
              >
                Pc
              </span>
              <span>Pal</span>
            </h1>
            <div
              className={`absolute ${
                isActive ? "w-16 h-7 translate-x--1.5 translate-y--1.5" : "w-4 h-4"
              } bg-primary-gradient z-5 right-0 bottom-2 transform transition-all duration-300 group-hover:translate-x--1.5 group-hover:translate-y--1.5 group-hover:w-16 group-hover:h-7 rounded`}
            />
          </div>
        )}
      </NavLink>
    )
  }

  return (
    <header className="flex flex-row items-center justify-between px-2 py-2 border-b-2 border-gray-100 mb-2 text-nowrap">
      {renderTitle()}
      <nav>
        <ul className="flex flex-row gap-2 px-2">{renderLinks()}</ul>
      </nav>
      <AuthModal
        isOpen={openedModal === "auth"}
        onClose={handleModalClose}
      />
      <CartModal
        isOpen={openedModal === "cart"}
        onClose={handleModalClose}
      />
      <WishListModal
        isOpen={openedModal === "wishlist"}
        onClose={handleModalClose}
      />
    </header>
  )
}

export default Header
