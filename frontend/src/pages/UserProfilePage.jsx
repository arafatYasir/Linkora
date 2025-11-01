import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useGetUserQuery } from "../../api/authApi";
import NotFound from "../components/NotFound";
import defaultCover from "../../public/default images/defaultcover.jpg"
import defaultPhoto from "../../public/default images/avatar.png"
import { useEffect, useRef, useState } from "react";
import CoverPhoto from "../components/profile/CoverPhoto";
import ProfilePictureInfos from "../components/profile/ProfilePictureInfos";
import ProfileItems from "../components/profile/ProfileItems";

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
    const { data: user, isLoading } = useGetUserQuery(USERNAME);
    console.log(user);


    // useEffect to close dropdowns
    useEffect(() => {
        const handleCloseDropdowns = (e) => {
            // cover options dropdown
            if (coverOptionsRef.current && !coverOptionsRef.current.contains(e.target)) {
                setShowCoverOptions(false);
            }
        }

        document.addEventListener("mousedown", handleCloseDropdowns);

        return () => document.removeEventListener("mousedown", handleCloseDropdowns);
    }, [])

    if (isLoading) return <div className="text-3xl text-center">Loading...</div>

    return (
        <div className="max-w-[940px] mx-auto">

            {user.status === "Not Found" ? <NotFound /> : (
                <div>
                    <div className="relative">
                        {/* ---- Cover Photo ---- */}
                        <CoverPhoto user={user} defaultCover={defaultCover} coverOptionsRef={coverOptionsRef} showCoverOptions={showCoverOptions} setShowCoverOptions={setShowCoverOptions} />

                        {/* ---- Profile Picture & Infos ---- */}
                        <ProfilePictureInfos user={user} defaultPhoto={defaultPhoto} />
                    </div>

                    {/* ---- Profile Items ---- */}
                    <ProfileItems user={user} />
                </div>
            )}
        </div>
    )
}

export default UserProfilePage