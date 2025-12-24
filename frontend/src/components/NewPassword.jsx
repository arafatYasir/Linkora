import { useState } from "react"
import { useNewPasswordMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import CustomInput from "./common/CustomInput";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

const NewPassword = ({ user }) => {
    // States
    const [password, setPassword] = useState("");
    const [newPassword, { isLoading, data }] = useNewPasswordMutation();
    const [error, setError] = useState("");

    // Extra hooks
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetting previous error message
        setError("");

        // Password validation
        if (password.trim() === "") {
            setError("Password is required");
            return;
        }
        else if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        try {
            const res = await newPassword({ email: user.email, password }).unwrap();

            if (res?.status && res?.status === "OK") {
                toast.success(res.message);
                
                navigate("/login");
            }

        } catch (e) {
            console.error(e)
            toast.error(e.data.error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Create New Password</h2>
                <p className="text-sm text-text-secondary">
                    Please enter a strong password to secure your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                            <FiLock size={20} />
                        </div>
                        <CustomInput
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="New password"
                            paddingX="40px"
                            paddingY="12px"
                            backgroundColor="var(--color-bg)"
                            width="100%"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="text-error text-sm mt-1.5">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-5 rounded-lg font-semibold text-white bg-gradient-primary transition-[var(--transition-default)] ${isLoading
                        ? "bg-primary-hover/80 cursor-not-allowed opacity-70"
                        : "bg-primary-hover cursor-pointer opacity-100"
                        } active:scale-98 hover:bg-primary-hover/80`}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    )
}

export default NewPassword
