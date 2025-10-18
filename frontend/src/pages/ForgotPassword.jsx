import { useState } from "react"
import FindAccount from "../components/FindAccount"
import ResetPassword from "../components/ResetPassword";
import ResetPasswordConfirmation from "../components/ResetPasswordConfirmation";
import NewPassword from "../components/NewPassword";

const ForgotPassword = () => {
    const [visibility, setVisibility] = useState(0);
    const [user, setUser] = useState({});

    const renderComponent = () => {
        switch(visibility) {
            case 0:
                return <FindAccount setUser={setUser} setVisibility={setVisibility} />
            case 1:
                if(user) {
                    return <ResetPassword user={user} setVisibility={setVisibility} />
                }
                setVisibility(0);
                break;
            case 2:
                if(user) {
                    return <ResetPasswordConfirmation user={user} setVisibility={setVisibility} />
                }
                setVisibility(0);
                break;
            case 3:
                if(user) {
                    return <NewPassword user={user} />
                }
                setVisibility(0);
                break;
            default: 
                return null;
        }
    }

    return (
        <div>
            {renderComponent()}
        </div>
    )
}

export default ForgotPassword