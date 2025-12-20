import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import FriendsSidebar from "../friends/FriendsSidebar"

const FriendsLayout = () => {
  return (
    <>
        <Navbar />

        <main className="flex gap-x-10">
            <FriendsSidebar />
            <Outlet />
        </main>
    </>
  )
}

export default FriendsLayout