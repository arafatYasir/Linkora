import { useVerifyResetCodeMutation } from "../../api/authApi"
import { useState } from "react";
import CustomInput from "./common/CustomInput";
import { FiHash } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPasswordConfirmation = ({ user, setVisibility }) => {
    // States
    const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetting previous error message
        setError("");

        if (code.length !== 6) {
            setError("Enter a 6-digit code.");
            return;
        }

        try {
            const res = await verifyResetCode({ email: user.email, code }).unwrap();

            if (res?.status && res?.status === "OK") {
                setVisibility(3);
            }
        } catch (e) {
            console.error(e);
            toast.error(e.data.error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Enter Verification Code</h2>
                <p className="text-sm text-text-secondary">
                    A password reset code has been sent to
                </p>
                <p className="font-medium text-text-primary text-sm mt-1">{user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                            <FiHash size={20} />
                        </div>
                        <CustomInput
                            type="text"
                            value={code}
                            setValue={setCode}
                            placeholder="6-digit code"
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

                <div className="flex gap-x-4">
                    <button
                        type="button"
                        onClick={() => setVisibility(1)}
                        className="flex-1 py-3 px-5 rounded-lg font-semibold text-text-primary bg-surface border border-border hover:bg-bg ransition-[var(--transition-default)] active:scale-98 cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 py-3 px-5 rounded-lg font-semibold text-white bg-gradient-primary transition-[var(--transition-default)] ${isLoading
                            ? "bg-primary-hover/80 cursor-not-allowed opacity-70"
                            : "bg-primary-hover cursor-pointer opacity-100"
                            } active:scale-98 hover:bg-primary-hover/80`}
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-sm text-text-secondary">
                    Didn't receive the code?{" "}
                    <button className="text-primary font-medium hover:underline cursor-pointer">Resend</button>
                </p>
            </div>  
        </div>
    )
}

export default ResetPasswordConfirmation
