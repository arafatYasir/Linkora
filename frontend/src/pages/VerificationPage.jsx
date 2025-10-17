import { useNavigate, useParams } from "react-router-dom"
import { useVerifyUserMutation } from "../../api/authApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const VerificationPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [verifyUser, { isLoading, error, isSuccess }] = useVerifyUserMutation();
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        const verify = async () => {
            try {
                if (!userInfo) {
                    const res = await verifyUser(token);
                    console.log(res.data);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        verify();
    }, [])

    if (isSuccess) {
        setTimeout(() => {
            navigate("/login");
        }, 800)
    }

    return (
        <div>
            {isLoading && <p className="text-xl">Verifying your email</p>}
            {error && <p className="text-xl text-red-500">{error.data.error}</p>}
            {isSuccess && <>
                <p className="text-xl text-green-500">You are successfully verified! Redirecting to login page...</p>

                <div className="animate-spin border border-gray-300 w-[50px] h-[50px]"></div>
            </>}
        </div>
    )
}

export default VerificationPage