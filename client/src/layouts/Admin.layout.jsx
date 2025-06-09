import { Outlet } from "react-router"
import { redirect } from "react-router"

import useAuthStore from "../store/useAuthStore"

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user)

  console.log(user, user?.role)

  if (user?.role !== "ADMIN") redirect("/")

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AdminLayout
