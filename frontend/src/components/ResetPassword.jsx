import { Link } from "react-router-dom"
import { useSendResetCodeMutation } from "../../api/authApi"

const ResetPassword = ({ user, setVisibility }) => {

    const [sendResetCode, {isLoading, error, data}] = useSendResetCodeMutation();

    const handleSendCode = async () => {
        try {
            const res = await sendResetCode(user.email);

            if(res.data?.message && res.data?.message.trim() !== "") {
                setVisibility(2);
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div>
            <p className="text-xl mb-3">Reset Password</p>

            <p className="text-xl mb-3">Is this your account? If yes then cilck continue to proceed.</p>

            {error && <p className="text-lg text-red-500">{error.data.error}</p>}

            <div className="flex items-center gap-x-10">
                <div className="flex items-center gap-x-3">
                    <input id="email" type="radio" defaultChecked={true} />
                    <label htmlFor="email">{user.email}</label>
                </div>

                <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
                    <img src={user.profilePicture || ""} alt={`${user.email}'s Profile Picture`} />
                </div>
            </div>

            <div>
                <Link to="/login" className="bg-[tomato] py-2.5 px-5 rounded ml-5 cursor-pointer">Cancel</Link>
                <button onClick={handleSendCode} className="bg-[dodgerblue] py-2.5 px-5 rounded ml-5 cursor-pointer">{isLoading ? "Continuing..." : "Continue"}</button>
            </div>
        </div>
    )
}

export default ResetPassword