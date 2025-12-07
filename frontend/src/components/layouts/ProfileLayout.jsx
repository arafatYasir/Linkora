import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"

const ProfileLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default ProfileLayout