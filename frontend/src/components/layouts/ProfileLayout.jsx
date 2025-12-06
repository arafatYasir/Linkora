import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"

const ProfileLayout = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default ProfileLayout