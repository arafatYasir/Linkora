import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useGetAllPostsQuery, useGetUserQuery } from "../../api/authApi";
import NotFound from "../components/NotFound";
import defaultCover from "../../public/default images/defaultcover.jpg"
import defaultPhoto from "../../public/default images/avatar.png"
import { useEffect, useRef, useState } from "react";
import CoverPhoto from "../components/profile/CoverPhoto";
import ProfilePictureInfos from "../components/profile/ProfilePictureInfos";
import ProfileItems from "../components/profile/ProfileItems";
import { updatePosts } from "../slices/authSlice";

const UserProfilePage = () => {
    // States
    const [showCoverOptions, setShowCoverOptions] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Post fetching api
    const { data: posts, refetch: refetchPosts } = useGetAllPostsQuery(null, {skip: userInfo.profilePicture !== userInfo.posts[0].user.profilePicture ? false : true});

    // Extra hooks
    const coverOptionsRef = useRef(null);
    const dispatch = useDispatch();

    // Taking username from the url params
    const { username } = useParams();

    // Checking if the username is the same logged user's username
    let isOwnProfile = true;

    if (username && username.trim() !== "" && username !== userInfo.username) {
        isOwnProfile = false;
    }

    // Fetching user data if that is another user's profile
    const { data: user, isLoading } = useGetUserQuery(username, { skip: isOwnProfile });

    // Choosing the profile data to show
    const userProfile = isOwnProfile ? userInfo : user;

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
    }, []);

    // useEffect to handle re-fetched data
    useEffect(() => {
        if(posts && posts.length > 0) {
            dispatch(updatePosts(posts));

            const userData = JSON.parse(localStorage.getItem("userInfo"));
            userData.posts = [...posts];
            localStorage.setItem("userInfo", JSON.stringify(userData));
        }
    }, [posts, dispatch]);

    if (isLoading) return <div className="text-3xl text-center">Loading...</div>

    return (
        <div className="max-w-[1100px] mx-auto">

            {(!isOwnProfile) && user.status === "Not Found" ? <NotFound /> : (
                <div>
                    <div className="relative">
                        {/* ---- Cover Photo ---- */}
                        <CoverPhoto user={userProfile} defaultCover={defaultCover} coverOptionsRef={coverOptionsRef} showCoverOptions={showCoverOptions} setShowCoverOptions={setShowCoverOptions} />

                        {/* ---- Profile Picture & Infos ---- */}
                        <ProfilePictureInfos user={userProfile} defaultPhoto={defaultPhoto} refetchPosts={refetchPosts} />
                    </div>

                    {/* ---- Profile Items ---- */}
                    <ProfileItems user={userProfile} />
                </div>
            )}
        </div>
    )
}

export default UserProfilePage