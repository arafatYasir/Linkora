import { Link } from "react-router-dom"
import { useVerifyResetCodeMutation } from "../../api/authApi"
import { useState } from "react";

const ResetPasswordConfirmation = ({user, setVisibility}) => {
    const [verifyResetCode, {isLoading, error}] = useVerifyResetCodeMutation();
    const [code, setCode] = useState("");

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await verifyResetCode({email: user.email, code});

            if(res.data?.status && res.data?.status === "OK") {
                setVisibility(3);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div>
            <p className="text-xl mb-1">Enter the code</p>
            <p className="mb-2 text-green-500">A password reset verification code has been sent to you!</p>

            {error && <p className="text-lg text-red-500">{error.data.error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    className="px-2 py-2 border" type="text" placeholder="Code" name="number"
                    value={code} onChange={(e) => setCode(e.target.value)}
                />

                <div className="mt-5">
                    <Link to="/login" className="bg-[tomato] py-2.5 px-5 rounded cursor-pointer">Cancel</Link>
                    <button type="submit" className="bg-[dodgerblue] py-2.5 px-5 rounded ml-5 cursor-pointer">{isLoading ? "Verifying..." : "Continue"}</button>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordConfirmation