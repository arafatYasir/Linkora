import { useState } from "react";
import { useFindUserMutation } from "../../api/authApi";
import { MdOutlineMailOutline } from "react-icons/md";
import CustomInput from "./common/CustomInput";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"

const FindAccount = ({ setUser, setVisibility }) => {
    // States
    const [email, setEmail] = useState("");
    const [findUser, { isLoading }] = useFindUserMutation();
    const [error, setError] = useState("");

    // Constants
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetting previous error message
        setError("");

        // Email validation
        if(email.trim() === "") {
            setError("Email is required");
            return;
        }
        if(!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

        try {
            const res = await findUser(email).unwrap();

            if (res?.email && res?.email.trim() !== "") {
                setUser(res);
                setVisibility(1);
            }
        }
        catch (e) {
            console.error(e);
            toast.error(e.data.error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Find Your Account</h2>
                <p className="text-sm text-text-secondary">
                    Please enter your email address to search for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                            <MdOutlineMailOutline size={22} />
                        </div>
                        <CustomInput
                            type="email"
                            value={email}
                            setValue={setEmail}
                            placeholder="Email address"
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
                    {isLoading ? "Searching..." : "Search Account"}
                </button>
            </form>

            <div className="text-center">
                <Link
                    to="/login"
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--color-primary)" }}
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default FindAccount
