import { FaHome, FaUsers, FaVideo, FaUser } from "react-icons/fa"
import { CgProfile } from "react-icons/cg";

export const navIcons = [
    {
        icon: FaHome,
        path: "/",
    },
    {
        icon: CgProfile,
        path: "/profile",
    },
    {
        icon: FaUsers,
        path: "/friends",
    },
    {
        icon: FaVideo,
        path: "/videos",
    }
];