import { useSendResetCodeMutation } from "../../api/authApi"
import { toast } from "react-toastify"

const ResetPassword = ({ user, setVisibility }) => {

    const [sendResetCode, { isLoading }] = useSendResetCodeMutation();

    const handleSendCode = async () => {
        try {
            const res = await sendResetCode(user.email).unwrap();

            if (res?.message && res?.message.trim() !== "") {
                setVisibility(2);
                toast.success(res.message);
            }

        } catch (e) {
            console.error(e);
            toast.error(e.data.error);
        }
    }

    return (
        <div className="space-y-6">
            {/* ---- Header ---- */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Reset Your Password</h2>
                <p className="text-sm text-text-secondary">
                    Is this your account? If yes, click continue to receive a reset code.
                </p>
            </div>

            {/* ---- User Info ---- */}
            <div className="p-4 rounded-xl border border-border bg-bg flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                    <div className="w-12 h-12 rounded-full bg-surface border border-border overflow-hidden">
                        <img
                            src={user.profilePicture || "/default images/avatar.png"}
                            alt={`${user.firstname}'s Profile Picture`}
                            className="w-full h-full object-cover select-none"
                        />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">{user.firstname} {user.lastname}</p>
                        <p className="text-xs text-text-secondary mt-1">{user.email}</p>
                    </div>
                </div>
                <input id="email" type="radio" defaultChecked={true} className="w-4 h-4 accent-primary" />
            </div>

            {/* ---- Buttons ---- */}
            <div className="flex gap-x-4">
                <button
                    onClick={() => setVisibility(0)}
                    className="flex-1 py-3 px-5 rounded-lg font-semibold text-text-primary bg-surface border border-border hover:bg-bg transition-[var(--transition-default)] active:scale-98 cursor-pointer"
                >
                    Not Me
                </button>
                <button
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-5 rounded-lg font-semibold text-white bg-gradient-primary transition-[var(--transition-default)] ${isLoading
                        ? "bg-primary-hover/80 cursor-not-allowed opacity-70"
                        : "bg-primary-hover cursor-pointer opacity-100"
                        } active:scale-98 hover:bg-primary-hover/80`}
                >
                    {isLoading ? "Sending..." : "Continue"}
                </button>
            </div>
        </div>
    )
}

export default ResetPassword
