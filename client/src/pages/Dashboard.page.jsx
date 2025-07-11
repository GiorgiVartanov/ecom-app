import { Link } from "react-router"

const Dashboard = () => {
  return (
    <div className="grid place-content-center h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2">
        <Link
          to="/search"
          className="col-span-full md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 px-14 py-7 bg-primary rounded text-background font-semibold hover:brightness-105 transition-all duration-200 text-center bg-primary-gradient shadow-md"
        >
          Products
        </Link>
        <Link
          to="/dashboard/products/add"
          className="col-span-full md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-2 px-14 py-7 bg-primary rounded text-background font-semibold hover:brightness-105 transition-all duration-200 text-center bg-primary-gradient shadow-md"
        >
          Add New Product
        </Link>
        <Link
          to="/dashboard/orders"
          className="col-span-full md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 px-14 py-7 bg-primary rounded text-background font-semibold hover:brightness-105 transition-all duration-200 text-center bg-primary-gradient shadow-md"
        >
          Orders
        </Link>
        <Link
          to="/dashboard/sales"
          className="col-span-full md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 px-14 py-7 bg-primary rounded text-background font-semibold hover:brightness-105 transition-all duration-200 text-center bg-primary-gradient shadow-md"
        >
          Sales
        </Link>
        <Link
          to="/dashboard/users"
          className="col-span-full md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3 px-14 py-7 bg-primary rounded text-background font-semibold hover:brightness-105 transition-all duration-200 text-center bg-primary-gradient shadow-md"
        >
          Users
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
