import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="container mx-auto">
        <Outlet />
    </div>
  )
}

export default RootLayout