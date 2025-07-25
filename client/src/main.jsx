import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ToastContainer, cssTransition } from "react-toastify"

import "./index.css"

import MainLayout from "./layouts/Main.layout.jsx"
import ProtectedRoute from "./layouts/ProtectedRoute.layout.jsx"

import Home from "./pages/Home.page.jsx"
import Search from "./pages/Search.page.jsx"
import ProductDetails from "./pages/ProductDetails.page.jsx"
import Profile from "./pages/Profile.page.jsx"
import Checkout from "./pages/Checkout.page.jsx"
import Orders from "./pages/Orders.page.jsx"
import PageNotFound from "./pages/PageNotFound.page.jsx"
import About from "./pages/About.page.jsx"

import Dashboard from "./pages/Dashboard.page.jsx"
import OrdersDashboard from "./pages/dashboard/Orders.dashboard.page.jsx"
import AddProductDashboard from "./pages/dashboard/AddProduct.dashboard.page.jsx"
import EditProductDashboard from "./pages/dashboard/EditProduct.dashboard.page.jsx"
import SalesDashboard from "./pages/dashboard/Sales.dashboard.page.jsx"
import UsersDashboard from "./pages/dashboard/Users.dashboard.page.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
      cacheTime: 600000, // 10 minutes
    },
  },
})

const renderRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<Home />}
          />
          <Route
            path="search"
            element={<Search />}
          />
          <Route
            path="product/:id"
            element={<ProductDetails />}
          />
          <Route
            path="about"
            element={<About />}
          />
          <Route element={<ProtectedRoute role="USER" />}>
            <Route
              path="profile/:id"
              element={<Profile />}
            />
            <Route
              path="checkout"
              element={<Checkout />}
            />
            <Route
              path="orders"
              element={<Orders />}
            />
          </Route>

          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
            <Route
              path="dashboard/orders"
              element={<OrdersDashboard />}
            />
            <Route
              path="dashboard/products"
              element={<Search />}
            />
            <Route
              path="dashboard/products/add"
              element={<AddProductDashboard />}
            />
            <Route
              path="dashboard/products/edit/:id"
              element={<EditProductDashboard />}
            />
            <Route
              path="dashboard/sales"
              element={<SalesDashboard />}
            />
            <Route
              path="dashboard/users"
              element={<UsersDashboard />}
            />
          </Route>

          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {renderRoutes()}

      <ToastContainer
        position="bottom-right"
        transition={cssTransition({
          enter: "fastSlideIn",
          exit: "fastSlideOut",
          duration: [200, 200],
          collapse: true,
          collapseDuration: 200,
        })}
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
      />

      <ReactQueryDevtools
        initialIsOpen
        buttonPosition="bottom-left"
        position="bottom"
        panelProps={{ style: { zIndex: 9999 } }}
      />
    </QueryClientProvider>
  )
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
