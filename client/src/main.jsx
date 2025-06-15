import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import "./index.css"

import MainLayout from "./layouts/Main.layout.jsx"
import AdminLayout from "./layouts/Admin.layout.jsx"

import Home from "./pages/Home.page.jsx"
import Search, { loader as searchLoader } from "./pages/Search.page.jsx"
import ProductDetails, { loader as productLoader } from "./pages/ProductDetails.page.jsx"
import Dashboard from "./pages/Dashboard.page.jsx"
import PageNotFound from "./pages/PageNotFound.page.jsx"
import Profile from "./pages/Profile.page.jsx"

import OrdersDashboard from "./pages/dashboard/Orders.dashboard.page.jsx"
import ProductsDashboard, {
  loader as adminProductsLoader,
} from "./pages/dashboard/Products.dashboard.page.jsx"
import AddProductDashboard from "./pages/dashboard/AddProduct.dashboard.page.jsx"
import EditProductDashboard, {
  loader as editProductLoader,
} from "./pages/dashboard/EditProduct.dashboard.page.jsx"
import SalesDashboard from "./pages/dashboard/Sales.dashboard.page.jsx"
import UsersDashboard from "./pages/dashboard/Users.dashboard.page.jsx"

import ErrorBoundary from "./components/structure/ErrorBoundary.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
      cacheTime: 600000, // 10 minutes
    },
  },
})

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
        loader: searchLoader(queryClient),
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
        loader: productLoader(queryClient),
      },
      {
        path: "profile/:id",
        element: <Profile />,
        // loader: profileLoader(queryClient),
      },
      {
        path: "dashboard",
        element: <AdminLayout />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "orders", element: <OrdersDashboard /> },
          {
            path: "products",
            element: <ProductsDashboard />,
            loader: adminProductsLoader(queryClient),
          },
          { path: "products/add", element: <AddProductDashboard /> },
          {
            path: "products/edit/:id",
            element: <EditProductDashboard />,
            loader: editProductLoader,
          },
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={true}
          buttonPosition="bottom-left"
          position="bottom"
          panelProps={{
            style: { zIndex: 9999 },
          }}
        />
      )}
    </QueryClientProvider>
  </StrictMode>
)
