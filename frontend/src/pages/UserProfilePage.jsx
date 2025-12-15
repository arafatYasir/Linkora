import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useGetUserQuery, useListImagesQuery } from "../../api/authApi";
import { setUser } from "../slices/authSlice";
import NotFound from "../components/NotFound";
import defaultCover from "../../public/default images/defaultcover.jpg"
import defaultPhoto from "../../public/default images/avatar.png"
import { useEffect } from "react";
import CoverPhoto from "../components/profile/cover/CoverPhoto";
import ProfilePictureInfos from "../components/profile/ProfilePictureInfos";
import ProfileItems from "../components/profile/ProfileItems";
import { setPosts } from "../slices/postsSlice";

const UserProfilePage = () => {
    // Redux states
    const { userInfo } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.posts);

    // Extra hooks
    const dispatch = useDispatch();

    // Taking username from the url params
    const { username } = useParams();

    // Checking if the username is the same logged user's username
    let isOwnProfile = !username || username.trim() === "" || username.trim() === userInfo.username;

    // Fetching user data
    const { data: user, isLoading, error: userError, refetch: refetchUser } = useGetUserQuery(isOwnProfile ? userInfo.username : username);

    // User Profile
    const userProfile = user;

    // Image fetching api
    const path = user?.username;
    const sorting = "desc";
    const maxLimit = 30;

    const { data: images, isImagesLoading } = useListImagesQuery({ path, sorting, maxLimit }, { skip: !user?.username });

    // useEffect to scroll the user profile to top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [username]);

    // useEffect to save user data to redux and localstorage
    useEffect(() => {
        if (user) {
            // If the logged in user reloads then set the fetched data to 
            if (userInfo._id === user?._id) {
                // Set the user in redux
                dispatch(setUser(user));

                // Set the user in localstorage
                localStorage.setItem("userInfo", JSON.stringify(user));
            }
        }
    }, [user]);

    // useEffect to save posts to redux and localstorage
    useEffect(() => {
        if (user?.posts) {
            dispatch(setPosts(user.posts));
        }
    }, [user?.posts]);

    if (isLoading && !isOwnProfile) return <div className="text-3xl text-center">Loading...</div>

    console.log(posts);

    return (
        <div className="max-w-[1100px] mx-auto">
            {userError?.status === 404 ? <NotFound /> : (
                <div>
                    <div className="relative">
                        {/* ---- Cover Photo ---- */}
                        <CoverPhoto user={userProfile} defaultCover={defaultCover} isImagesLoading={isImagesLoading} images={images} refetchUser={refetchUser} />

                        {/* ---- Profile Picture & Infos ---- */}
                        <ProfilePictureInfos user={userProfile} defaultPhoto={defaultPhoto} refetchUser={refetchUser} isImagesLoading={isImagesLoading} images={images} />
                    </div>

                    {/* ---- Profile Items ---- */}
                    <ProfileItems user={userProfile} posts={posts} isImagesLoading={isImagesLoading} images={images} />
                </div>
            )}
        </div>
    )
}

export default UserProfilePage