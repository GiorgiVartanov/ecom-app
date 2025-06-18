import Modal from "../common/Modal"

const WishListModal = ({ title, isOpen, onClose, className }) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      className={`${className}`}
    >
      WishListModal
    </Modal>
  )
}

export default WishListModal
