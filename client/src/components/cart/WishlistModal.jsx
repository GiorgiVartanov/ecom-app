import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

import { getWishList } from "../../api/wishlist.api"
import useAuthStore from "../../store/useAuthStore"

import Modal from "../common/Modal"
import CartItemList from "./CartItemList"

const WishListModal = ({ title, isOpen, onClose, className }) => {
  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const {
    data: wishlistItemList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => getWishList(token),
    enabled: !!user?.id,
  })

  if (!user || !token) return

  if (isLoading) return

  if (error) return

  return (
    <Modal
      title={title || "Your wishlist"}
      isOpen={isOpen}
      onClose={onClose}
      className={`max-w-[920px] pb-4 flex flex-col gap-4 p-2 ${className}`}
      isEditable={true}
    >
      {wishlistItemList?.length > 0 ? (
        <CartItemList
          cartItemList={wishlistItemList.map((item) => ({ id: item.id, product: { ...item } }))}
          editItems={() => {}}
          isEditable={false}
        />
      ) : (
        <div className="h-32 w-full grid place-content-center">
          <Link
            to="/search"
            onClick={onClose}
            className="link mt-auto pb-0 ml-2"
          >
            Your wishlist is empty
          </Link>
        </div>
      )}
    </Modal>
  )
}

export default WishListModal
