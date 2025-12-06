import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"

const RootLayout = () => {
  return (
    <main className="">
      <Navbar />
      <Outlet />
    </main>
  )
}

export default RootLayout