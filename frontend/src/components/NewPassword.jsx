import { useState } from "react"
import { useNewPasswordMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const NewPassword = ({user}) => {
    const [password, setPassword] = useState("");
    const [newPassword, {isLoading, error, data}] = useNewPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await newPassword({email: user.email, password});

            if(res.data?.status && res.data?.status === "OK") {
                setTimeout(() => {
                    navigate("/login");
                }, 1000)
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div>
            <p className="text-xl mb-3">Enter new password</p>
            {error && <p className="text-lg text-red-500">{error.data.error}</p>}
            {data && <p className="text-lg text-glow-green">{data.message}</p>}


            <form onSubmit={handleSubmit}>
                <input
                    className="px-2 py-2 border" type="text" placeholder="New password" name="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="bg-[dodgerblue] py-2.5 px-5 rounded ml-5 cursor-pointer">{isLoading ? "Resetting..." : "Reset"}</button>
            </form>
        </div>
    )
}

export default NewPassword