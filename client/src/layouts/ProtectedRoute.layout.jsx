import { Navigate, Outlet } from "react-router"
import useAuthStore from "../store/useAuthStore"

const hierarchy = ["GUEST", "USER", "EDITOR", "ADMIN"]

const ProtectedRoute = ({ role = "GUEST" }) => {
  const { isLoggedIn, user } = useAuthStore()
  const currentRole = user?.role || "GUEST"

  const currentIndex = hierarchy.indexOf(currentRole)
  const requiredIndex = hierarchy.indexOf(role)

  if (!isLoggedIn && role !== "GUEST") {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  if (currentIndex < requiredIndex) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
