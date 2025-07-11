import { useLayoutEffect } from "react"
import { Outlet, useLocation } from "react-router"

import Header from "../components/structure/Header"
import Footer from "../components/structure/Footer"

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="px-4 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <Footer />
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
