import { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginUserMutation } from "../../api/authApi";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loginUser, {isLoading, error}] = useLoginUserMutation();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // There will be obviously form validation

        // Login the user if everything is ok
        const res = await loginUser(formData);

        console.log(res.data);

        if(res.data.token) {
            setFormData({email: "", password: ""});
        }
    }

    return (
        <div className="container mx-auto">
            {error && <p className="text-xl text-red-500">{error.data.error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-wrap gap-12 items-center pt-10">
                <input
                    className="px-2 py-2 border" type="email" placeholder="Your email" name="email"
                    value={formData.email} onChange={handleChange}
                />

                <input
                    className="px-2 py-2 border" type="password" placeholder="Password" name="password"
                    value={formData.password} onChange={handleChange}
                />

                <button type="submit" className="bg-[dodgerblue] py-3 px-5 rounded ml-5">{isLoading ? "Logging..." : "Login"}</button>
            </form>

            <p className="mt-8">Doesn't have an account? <Link to="/signup" className="text-[green]">Sign Up</Link></p>
        </div>
    )
}


export default LoginPage