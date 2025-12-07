import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser } from "../../slices/authSlice";

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
        <div className="absolute top-full right-0 mt-2 w-[200px] bg-surface rounded-lg shadow-lg">
            <ul className="space-y-1">
                <li>
                    <Link to={`/profile/${userInfo?.username}`} className="block px-4 py-2 text-text-primary hover:bg-border rounded-lg transition">
                        Profile
                    </Link>
                </li>
                <li onClick={() => setShowSettings(true)}>
                    <button
                        
                        className="px-4 py-2 text-text-primary hover:bg-border rounded-lg transition w-full text-left cursor-pointer"
                    >
                        Settings
                    </button>
                </li>
                <li>
                    <button onClick={handleLogout} className="px-4 py-2 text-text-primary hover:bg-border rounded-lg transition w-full text-left cursor-pointer">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default HomePageProfileDropdown