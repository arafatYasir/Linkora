import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser, setUser } from "../slices/authSlice";
import { useEffect, useState } from "react";
import CreatePost from "../components/post/CreatePost";
import PostModal from "../components/post/PostModal";
import AllPosts from "../components/post/AllPosts";
import { useGetAllPostsQuery, useGetUserQuery } from "../../api/authApi";
import SearchBar from "../components/search/SearchBar";
import Navbar from "../components/Navbar";
import HomePageFriends from "../components/homepage/HomePageFriends";
import HomePageSidebar from "../components/homepage/HomePageSidebar";

const HomePage = () => {
    // States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const dispatch = useDispatch();

    // Fetching user
    const { data: user } = useGetUserQuery(userInfo.username);

    // Fetching posts
    const { data: allPosts, refetch: refetchPosts } = useGetAllPostsQuery();

    const openPostModal = () => {
        setIsPostModalOpen(true);
    }

    const closePostModal = () => {
        setIsPostModalOpen(false);
    }

    useEffect(() => {
        const body = document.querySelector("body");

        if (isPostModalOpen) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflowY = "scroll";
        }
    }, [isPostModalOpen]);

    useEffect(() => {
        if (allPosts) {
            setPosts(allPosts);
        }
    }, [allPosts]);

    useEffect(() => {
        if (user) {
            // Set the user in redux
            dispatch(setUser(user));

            // Set the user in localstorage
            localStorage.setItem("userInfo", JSON.stringify(user));
        }
    }, [user, dispatch]);

    return (
        <div className="grid grid-cols-12 gap-x-10">
            {/* ---- Left Section ---- */}
            <HomePageSidebar user={userInfo} />

            {/* ---- Posts ---- */}
            <div className="col-span-6">
                {/* ---- Post Creation ---- */}
                <div className="my-5">
                    <CreatePost onOpenModal={openPostModal} user={userInfo} />

                    {isPostModalOpen && <PostModal onClose={closePostModal} setPosts={setPosts} />}
                </div>

                {/* ---- All Posts ---- */}
                {
                    posts.length > 0 && <AllPosts posts={posts} setPosts={setPosts} />
                }
            </div>

            {/* ---- Design a friends part like facebook here in this component ---- */}
            <HomePageFriends friends={userInfo?.friends} />
        </div>
    )
}

export default HomePage