import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserNotLoggedIn = () => {
    const { userInfo } = useSelector(state => state.auth);
    return (
        userInfo ? <Navigate to="/" /> : <Outlet />
    )
}

export default UserNotLoggedIn