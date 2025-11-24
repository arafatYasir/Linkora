import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useGetAllPostsQuery, useGetUserPostsQuery, useGetUserQuery, useListImagesQuery } from "../../api/authApi";
import { logOutUser, setUser } from "../slices/authSlice";
import NotFound from "../components/NotFound";
import defaultCover from "../../public/default images/defaultcover.jpg"
import defaultPhoto from "../../public/default images/avatar.png"
import { useEffect, useState } from "react";
import CoverPhoto from "../components/profile/cover/CoverPhoto";
import ProfilePictureInfos from "../components/profile/ProfilePictureInfos";
import ProfileItems from "../components/profile/ProfileItems";
import { updatePosts } from "../slices/authSlice";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineNightlight } from "react-icons/md";

const UserProfilePage = () => {
    // States
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const dispatch = useDispatch();

    // Taking username from the url params
    const { username } = useParams();

    // Checking if the username is the same logged user's username
    let isOwnProfile = !username || username.trim() === "" || username.trim() === userInfo.username;

    // Fetching user data
    const { data: user, isLoading } = useGetUserQuery(isOwnProfile ? userInfo.username : username);

    // Post fetching api
    const { data: posts, refetch: refetchPosts } = useGetUserPostsQuery(userInfo._id, { skip: userInfo.profilePicture !== userInfo?.posts[0]?.user?.profilePicture ? false : true });

    // User Profile
    const userProfile = isOwnProfile ? userInfo : user;

    // Image fetching api
    const path = user?.username;
    const sorting = "desc";
    const maxLimit = 30;

    const { data: images, isImagesLoading } = useListImagesQuery({ path, sorting, maxLimit }, { skip: !user?.username });

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

    // useEffect to handle re-fetched post data
    useEffect(() => {
        if (posts && posts.length > 0) {
            dispatch(updatePosts(posts));

            const userData = JSON.parse(localStorage.getItem("userInfo"));
            userData.posts = [...posts];
            localStorage.setItem("userInfo", JSON.stringify(userData));
        }
    }, [posts, dispatch]);

    // useEffect to control body color theme
    useEffect(() => {
        const body = document.querySelector("body");

        if (theme === "light") {
            body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        else {
            body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
    }, [theme]);

    if (isLoading && !isOwnProfile) return <div className="text-3xl text-center">Loading...</div>

    console.log(userProfile);
    console.log(user);
    console.log(images);
    console.log("Rendering");

    return (
        <div className="max-w-[1100px] mx-auto">
            {/* Light/Dark Theme Toggle Button */}
            <button
                onClick={() => {
                    setTheme(prev => prev === "light" ? "dark" : "light");
                }}
                className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center hover:bg-primary/50 rounded-full cursor-pointer transition-all duration-250"
            >
                {theme === "dark" ? <MdOutlineLightMode size={20} /> : <MdOutlineNightlight size={20} />}
            </button>

            {userProfile?.status === "Not Found" ? <NotFound /> : (
                <div>
                    <div className="relative">
                        {/* ---- Cover Photo ---- */}
                        <CoverPhoto user={userProfile} defaultCover={defaultCover} isImagesLoading={isImagesLoading} images={images} />

                        {/* ---- Profile Picture & Infos ---- */}
                        <ProfilePictureInfos user={userProfile} defaultPhoto={defaultPhoto} refetchPosts={refetchPosts} isImagesLoading={isImagesLoading} images={images} />
                    </div>

                    {/* ---- Profile Items ---- */}
                    <ProfileItems user={userProfile} isImagesLoading={isImagesLoading} images={images} />
                </div>
            )}
        </div>
    )
}

export default UserProfilePage