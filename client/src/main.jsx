import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"

import { getProduct, getProducts } from "./api/products.api.js"

import MainLayout from "./layouts/Main.layout.jsx"
import AdminLayout from "./layouts/Admin.layout.jsx"

import Home from "./pages/Home.page.jsx"
import Search from "./pages/Search.page.jsx"
import Product from "./pages/ProductDetails.page.jsx"
import ProductDetails from "./pages/ProductDetails.page.jsx"
import Dashboard from "./pages/Dashboard.page.jsx"
import PageNotFound from "./pages/PageNotFound.page.jsx"

import OrdersDashboard from "./pages/dashboard/Orders.dashboard.page.jsx"
import ProductsDashboard from "./pages/dashboard/Products.dashboard.page.jsx"
import SalesDashboard from "./pages/dashboard/Sales.dashboard.page.jsx"
import UsersDashboard from "./pages/dashboard/Users.dashboard.page.jsx"

import ErrorBoundary from "./components/structure/ErrorBoundary.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },

      {
        path: "product",
        element: <Product />,
        loader: async ({ request }) => {
          const url = new URL(request.url)
          const params = Object.fromEntries(url.searchParams.entries())
          return await getProducts(params)
        },
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
        loader: async ({ params }) => {
          return await getProduct(params.id)
        },
      },
      {
        path: "dashboard",
        element: <AdminLayout />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "orders", element: <OrdersDashboard /> },
          { path: "products", element: <ProductsDashboard /> },
          { path: "sales", element: <SalesDashboard /> },
          { path: "users", element: <UsersDashboard /> },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
])

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
