import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../slices/authSlice";
import { useEffect, useState } from "react";
import CreatePost from "../components/post/CreatePost";
import PostModal from "../components/post/PostModal";
import AllPosts from "../components/post/AllPosts";
import { useGetAllPostsQuery, useGetPostQuery, useGetUserQuery } from "../../api/authApi";
import HomePageFriends from "../components/homepage/HomePageFriends";
import HomePageSidebar from "../components/homepage/HomePageSidebar";
import PostModalView from "../components/post/PostModalView";
import { setPosts } from "../slices/postsSlice";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const HomePage = () => {
    // States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [showSharedPostModal, setShowSharedPostModal] = useState(false);
    const [sharedPostId, setSharedPostId] = useState(null);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.posts);

    // Extra hooks
    const dispatch = useDispatch();
    const path = useLocation();

    // Fetching user
    const { data: user } = useGetUserQuery(userInfo.username);

    // Fetching posts
    const { data: allPosts } = useGetAllPostsQuery();

    // Shared post fetching api
    const { data: sharedPost, error: sharedPostError } = useGetPostQuery(sharedPostId, { skip: !sharedPostId });

    const openPostModal = () => {
        setIsPostModalOpen(true);
    }

    const closePostModal = () => {
        setIsPostModalOpen(false);
    }

    const closeSharedPostModal = () => {
        setShowSharedPostModal(false);
    }

    useEffect(() => {
        // Checking if there is any post id in url
        if (path.pathname.includes("/posts/")) {
            const postId = path.pathname.split("/posts/")[1];
            setSharedPostId(postId);
        }
    }, [path.pathname]);

    useEffect(() => {
        const body = document.querySelector("body");

        if (sharedPost && Object.keys(sharedPost).length > 0) {
            setShowSharedPostModal(true);
        }
        else if (sharedPostError) {
            toast.error(sharedPostError.data.error);
        }
    }, [sharedPost, sharedPostError]);

    useEffect(() => {
        const body = document.querySelector("body");

        if (isPostModalOpen || showSharedPostModal) {
            body.style.overflow = "hidden";
        }

        return () => body.style.overflow = "auto";
    }, [isPostModalOpen, showSharedPostModal]);

    useEffect(() => {
        if (allPosts) {
            dispatch(setPosts(allPosts));
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
        <div className="grid grid-cols-12 gap-x-10 items-start mt-5 min-h-screen">
            {/* ---- Left Section ---- */}
            <HomePageSidebar user={userInfo} />

            {/* ---- Posts ---- */}
            <div className="col-span-6">
                {/* ---- Post Creation ---- */}
                <div className="mb-5">
                    <CreatePost onOpenModal={openPostModal} user={userInfo} />
                </div>

                {isPostModalOpen && <PostModal onClose={closePostModal} setPosts={setPosts} />}

                {/* ---- All Posts ---- */}
                {
                    posts.length > 0 && <AllPosts posts={posts} setPosts={setPosts} />
                }
            </div>

            {/* ---- Design a friends part like facebook here in this component ---- */}
            <HomePageFriends friends={userInfo?.friends} />

            {/* ---- Showing shared post in a modal view ---- */}
            {showSharedPostModal && <PostModalView post={sharedPost.post} onClose={closeSharedPostModal} />}
        </div>
    )
}

export default HomePage