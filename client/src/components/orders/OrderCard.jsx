import CartItem from "../cart/CartItem"

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]

const borderColors = {
  PENDING: "border-blue-200 bg-blue-100/50",
  PROCESSING: "border-blue-300 bg-blue-100/50",
  SHIPPED: "border-blue-400 bg-blue-100/50",
  DELIVERED: "border-green-400 bg-green-100/50",
}

const backgroundColors = {
  PENDING: "bg-blue-300 after:bg-blue-300 before:bg-blue-300",
  PROCESSING: "bg-blue-400 after:bg-blue-400 before:bg-blue-400",
  SHIPPED: "bg-blue-500 after:bg-blue-500 before:bg-blue-500",
  DELIVERED: "bg-green-400 after:bg-green-400 before:bg-green-400",
}

const OrderCard = ({ order, isAdmin, onOrderUpdate }) => {
  const { id, total, orderItems, status, createdAt, user } = order

  const currentShade = borderColors[status] || "border-gray-200"

  const renderOrderStatus = () => {
    return (
      <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center sm:items-stretch">
        {statuses.map((statusName, statusIndex) => {
          // determines if this step is done (current or previous)
          const isDone = statusIndex <= statuses.indexOf(status)
          // picks a full class string or grey
          const colorClasses = isDone
            ? backgroundColors[status]
            : "bg-gray-300 after:bg-gray-300 before:bg-gray-300"

          return (
            <div
              key={statusIndex}
              className={`capitalize relative text-sm font-semibold z-10 text-background px-4 sm:px-6 py-2 sm:py-3 rounded-full after:content-[''] after:z-10 after:h-4 after:w-3 after:absolute after:-right-1.5 after:top-1/2 after:-translate-y-1/2 last:after:invisible before:z-10 before:h-4 before:w-3 before:absolute before:-left-1.5 before:top-1/2 before:-translate-y-1/2 first:before:invisible before:duration-200 before:transition-color after:duration-200 after:transform-color duration-200 transform-color before:invisible after:invisible sm:before:visible sm:after:visible ${colorClasses}`}
            >
              {statusName.toLowerCase()}
            </div>
          )
        })}
      </div>
    )
  }

  const renderOrderStatusButtons = () => {
    return (
      <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center sm:items-stretch">
        {statuses.map((statusName, statusIndex) => {
          const isDone = statusIndex <= statuses.indexOf(status)
          const colorClasses = isDone
            ? backgroundColors[status]
            : "bg-gray-300 after:bg-gray-300 before:bg-gray-300"

          return (
            <button
              key={statusIndex}
              onClick={() => onOrderUpdate({ orderId: id, status: statusName })}
              className={`capitalize relative text-sm font-semibold z-10 text-background px-4 sm:px-6 py-2 sm:py-3 rounded-full after:content-[''] after:z-10 after:h-4 after:w-3 after:absolute after:-right-1.5 after:top-1/2 after:-translate-y-1/2 last:after:invisible before:z-10 before:h-4 before:w-3 before:absolute before:-left-1.5 before:top-1/2 before:-translate-y-1/2 first:before:invisible before:duration-200 before:transition-color after:duration-200 after:transform-color duration-200 transform-color cursor-pointer before:invisible after:invisible sm:before:visible sm:after:visible ${colorClasses}`}
            >
              {statusName.toLowerCase()}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${currentShade}`}>
      <div className="flex flex-col gap-2">
        <div className="px-3 py-1 flex flex-row gap-6 text-md mb-4 font-semibold">
          {user ? <span>{user?.name}</span> : ""}
          <span>
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>{total} $</span>
        </div>
        {orderItems.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            quantity={item.quantity}
            product={item.product}
            isEditable={false}
          />
        ))}
      </div>
      {isAdmin ? renderOrderStatusButtons() : renderOrderStatus()}
    </div>
  )
}

export default OrderCard
