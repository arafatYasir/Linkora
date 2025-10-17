import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser } from "../slices/authSlice";

const HomePage = () => {
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleLogOut = () => {
        setTimeout(() => {
            localStorage.removeItem("userInfo");
            dispatch(logOutUser());
        }, 100)
    }

    return (
        <div className="flex gap-x-5 container mx-auto">
            {
                !userInfo && <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </>
            }

            <p className="border p-2 rounded-lg">User: {userInfo.firstname + " " + userInfo.lastname} </p>

            {userInfo && <button onClick={handleLogOut} className="bg-[tomato] px-3 py-1 rounded-lg cursor-pointer hover:bg-orange-800 transition">Log Out</button>}
        </div>
    )
}

export default HomePage