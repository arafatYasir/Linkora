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
    const [posts, setPosts] = useState([]);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

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
            setPosts(user?.posts);
            console.log(user?.posts);
        }
    }, [user?.posts]);

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

            {userError?.status === 404 ? <NotFound /> : (
                <div>
                    <div className="relative">
                        {/* ---- Cover Photo ---- */}
                        <CoverPhoto user={userProfile} defaultCover={defaultCover} isImagesLoading={isImagesLoading} images={images} refetchUser={refetchUser} />

                        {/* ---- Profile Picture & Infos ---- */}
                        <ProfilePictureInfos user={userProfile} defaultPhoto={defaultPhoto} refetchUser={refetchUser} isImagesLoading={isImagesLoading} images={images} />
                    </div>

                    {/* ---- Profile Items ---- */}
                    <ProfileItems user={userProfile} posts={posts} setPosts={setPosts} isImagesLoading={isImagesLoading} images={images} />
                </div>
            )}
        </div>
    )
}

export default UserProfilePage