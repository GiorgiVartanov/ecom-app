import { Outlet } from "react-router"

import Header from "../components/structure/Header"
import Footer from "../components/structure/Footer"

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
