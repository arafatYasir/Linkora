import { useState } from "react"
import FindAccount from "../components/FindAccount"
import ResetPassword from "../components/ResetPassword";
import ResetPasswordConfirmation from "../components/ResetPasswordConfirmation";
import NewPassword from "../components/NewPassword";

const ForgotPassword = () => {
    const [visibility, setVisibility] = useState(0);
    const [user, setUser] = useState({});

    const renderComponent = () => {
        switch (visibility) {
            case 0:
                return <FindAccount setUser={setUser} setVisibility={setVisibility} />
            case 1:
                if (user) {
                    return <ResetPassword user={user} setVisibility={setVisibility} />
                }
                setVisibility(0);
                break;
            case 2:
                if (user) {
                    return <ResetPasswordConfirmation user={user} setVisibility={setVisibility} />
                }
                setVisibility(0);
                break;
            case 3:
                if (user) {
                    return <NewPassword user={user} />
                }
                setVisibility(0);
                break;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg">
            <div className="w-full max-w-md">
                {/* ---- Header ---- */}
                <div className="text-center mb-8 flex flex-col items-center gap-y-4">
                    <div className="flex items-center gap-x-2">
                        <img
                            className="w-9 h-9"
                            src="/images/logo.svg"
                            alt="Logo of Linkora"
                            loading="lazy"
                        />
                        <h1 className="text-4xl font-bold text-primary-hover">Linkora</h1>
                    </div>
                </div>

                {/* ---- Card Container ---- */}
                <div className="rounded-lg p-6 shadow-lg bg-surface border border-border">
                    {renderComponent()}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
