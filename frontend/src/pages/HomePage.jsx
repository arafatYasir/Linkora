import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const HomePage = () => {
    const {userInfo} = useSelector(state => state.auth);
    return (
        <div className="flex gap-x-5 container mx-auto">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>

            <p className="border p-2 rounded-lg">User: {userInfo.firstname + " " + userInfo.lastname} </p>
        </div>
    )
}

export default HomePage