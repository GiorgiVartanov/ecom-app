import { useLayoutEffect } from "react"
import { Outlet, useLocation } from "react-router"

import Header from "../components/structure/Header"
import Footer from "../components/structure/Footer"
import ConfirmPanel from "../components/common/ConfirmPanel"

const Layout = () => {
  return (
    <div className="flex flex-col justify-between h-full min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="px-4">
        <Outlet />
      </main>
      <Footer />
      <ConfirmPanel />
    </div>
  )
}

export default Layout

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname, search])

  return null
}
