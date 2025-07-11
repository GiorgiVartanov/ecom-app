import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

import { getAllOrders, updateOrderStatus } from "../../api/orders.api"
import useAuthStore from "../../store/useAuthStore"

import OrderCard from "../../components/orders/OrderCard"

const OrdersDashboardPage = () => {
  const user = useAuthStore((store) => store.user)
  const token = useAuthStore((store) => store.token)

  const queryClient = useQueryClient()

  const {
    data: orderList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", "admin", user.id],
    queryFn: () => getAllOrders(token),
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", "admin", user.id])
    },
  })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Something went wrong</div>

  return (
    <div className="max-w-7xl mx-auto mt-2">
      <h1 className="text-lg font-semibold mb-4">Users&apos; Orders</h1>
      <div className="flex flex-col gap-4">
        {orderList.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isAdmin={true}
            onOrderUpdate={updateOrderStatusMutation.mutate}
          />
        ))}
      </div>
    </div>
  )
}

export default OrdersDashboardPage
