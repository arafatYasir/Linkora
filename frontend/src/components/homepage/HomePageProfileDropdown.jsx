import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser } from "../../slices/authSlice";
import { FaUserCircle } from "react-icons/fa";
import { IoMdSettings, IoMdLogOut } from "react-icons/io";

const HomePageProfileDropdown = ({ setShowSettings }) => {
    // Extra hooks
    const dispatch = useDispatch();

    // Redux store
    const { userInfo } = useSelector(state => state.auth);

    const handleLogout = () => {
        // Remove userInfo from localstorage
        localStorage.removeItem("userInfo");

        // Remove user from redux store
        dispatch(logOutUser());
    }

    return (
        <div className="absolute top-full right-0 mt-2 w-[220px] bg-surface rounded-lg shadow-lg border border-border overflow-hidden">
            <ul>
                <li>
                    <Link to={`/profile/${userInfo?.username}`} className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-border transition group">
                        <FaUserCircle size={18} className="text-blue-500 group-hover:text-blue-600 transition" />
                        <span className="font-medium">Profile</span>
                    </Link>
                </li>

                <li onClick={() => setShowSettings(true)}>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-border transition w-full text-left cursor-pointer group">
                        <IoMdSettings size={18} className="text-gray-500 group-hover:text-gray-600 transition" />
                        <span className="font-medium">Settings</span>
                    </button>
                </li>
                
                <li className="border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-border transition w-full text-left cursor-pointer group">
                        <IoMdLogOut size={18} className="text-red-500 group-hover:text-red-600 transition" />
                        <span className="font-medium">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default HomePageProfileDropdown