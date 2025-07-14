import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

import { getOrderList } from "../api/orders.api"
import { createQuery } from "../pages/Search.page"
import useAuthStore from "../store/useAuthStore"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import CartItem from "../components/cart/CartItem"
import OrderCard from "../components/orders/OrderCard"
import Loading from "../components/common/Loading"
import Select from "../components/common/Select"

const ORDERS_TO_SHOW_OPTIONS = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]

const Orders = () => {
  useDocumentTitle("Orders - PcPal", "View your orders on PcPal")

  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const [ordersToShow, setOrdersToShow] = useState(ORDERS_TO_SHOW_OPTIONS[0])

  const queryClient = useQueryClient()

  const {
    data: orderList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user.id],
    queryFn: () => getOrderList(token),
  })

  const handlePrefetch = () => {
    const filters = { query: "" }
    const { queryKey, queryFn } = createQuery(filters, token)

    queryClient.prefetchQuery({ queryKey, queryFn })
  }

  if (isLoading) return <Loading />

  if (error) return <div>Something went wrong</div>

  const renderOrderList = () => {
    if (isLoading) return <Loading />
    if (error) return <div>Something went wrong</div>

    return (
      <div className="flex flex-col gap-4">
        {orderList
          .filter((order) => order.status === ordersToShow || ordersToShow === "ALL")
          .map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
      </div>
    )
  }

  const renderEmptyOrderList = () => {
    return (
      <div className="h-full w-full place-content-center grid min-h-[calc(100vh-8rem)]">
        <div className="mb-28">
          <h2 className="text-3xl">You don't have any orders</h2>
          <Link
            to="/search"
            onMouseEnter={handlePrefetch}
            className="text-2xl font-semibold mt-2 link hover:text-primary text-center"
          >
            Browse shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-fit flex-1 max-w-7xl mx-auto mt-2">
      <div className="flex flex-row gap-4 items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Your Orders</h2>
        {orderList?.length > 0 ? (
          <Select
            options={ORDERS_TO_SHOW_OPTIONS}
            value={ordersToShow}
            includeDefaultOption={false}
            onChange={(e) => setOrdersToShow(e.target.value)}
          />
        ) : (
          ""
        )}
      </div>

      {orderList?.length > 0 ? renderOrderList() : renderEmptyOrderList()}
    </div>
  )
}

export default Orders
