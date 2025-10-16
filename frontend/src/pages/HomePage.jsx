import { Link } from "react-router-dom"

const HomePage = () => {
    return (
        <div className="flex gap-x-5 container mx-auto">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default HomePage