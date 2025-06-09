import { Link } from "react-router"

const Dashboard = () => {
  return (
    <div className="grid place-content-center h-[calc(100vh-8rem)]">
      <div className="flex md:flex-row flex-col gap-3">
        <Link
          to="/dashboard/products"
          className="px-12 py-6 bg-primary rounded-sm text-background font-semibold hover:brightness-125 transition-all duration-200 text-center"
        >
          Products
        </Link>
        <Link
          to="/dashboard/orders"
          className="px-12 py-6 bg-primary rounded-sm text-background font-semibold hover:brightness-125 transition-all duration-200 text-center"
        >
          Orders
        </Link>
        <Link
          to="/dashboard/sales"
          className="px-12 py-6 bg-primary rounded-sm text-background font-semibold hover:brightness-125 transition-all duration-200 text-center"
        >
          Sales
        </Link>
        <Link
          to="/dashboard/users"
          className="px-12 py-6 bg-primary rounded-sm text-background font-semibold hover:brightness-125 transition-all duration-200 text-center"
        >
          Users
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
