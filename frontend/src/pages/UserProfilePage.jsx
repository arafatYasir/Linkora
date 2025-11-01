import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useGetUserQuery } from "../../api/authApi";
import NotFound from "../components/NotFound";
import defaultCover from "../../public/default images/defaultcover.jpg"
import { useEffect, useRef, useState } from "react";
import CoverPhoto from "../components/profile/CoverPhoto";

const UserProfilePage = () => {
    // States
    const [showCoverOptions, setShowCoverOptions] = useState(false);

    // Extra hooks
    const coverOptionsRef = useRef(null);

    // Taking username from the url params
    const { username } = useParams();

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Determining which username to use
    const USERNAME = username ? username : userInfo.username;

    // RTK Query
    const { data, isLoading } = useGetUserQuery(USERNAME);
    console.log(data);


    // useEffect to close dropdowns
    useEffect(() => {
        const handleCloseDropdowns = (e) => {
            // cover options dropdown
            if(coverOptionsRef.current && !coverOptionsRef.current.contains(e.target)) {
                setShowCoverOptions(false);
            }
        }

        document.addEventListener("mousedown", handleCloseDropdowns);

        return () => document.removeEventListener("mousedown", handleCloseDropdowns);
    }, [])

    if (isLoading) return <div className="text-3xl text-center">Loading...</div>

    return (
        <div className="container mx-auto">
            {/* ---- Cover Photo ---- */}
            {data.status === "Not Found" ? <NotFound /> : <CoverPhoto data={data} defaultCover={defaultCover} coverOptionsRef={coverOptionsRef} showCoverOptions={showCoverOptions} setShowCoverOptions={setShowCoverOptions} />}
        </div>
    )
}

export default UserProfilePage