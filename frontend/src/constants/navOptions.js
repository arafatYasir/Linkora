import { FaHome, FaUsers, FaVideo } from "react-icons/fa"
import { CgProfile } from "react-icons/cg";

export const navIcons = [
    {
        icon: FaHome,
        path: "/",
        name: "Home"
    },
    {
        icon: CgProfile,
        path: "/profile",
        name: "Profile"
    },
    {
        icon: FaUsers,
        path: "/friends",
        name: "Friends"
    },
    {
        icon: FaVideo,
        path: "/videos",
        name: "Videos"
    }
];