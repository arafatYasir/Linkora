import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser, setUser } from "../slices/authSlice";
import { useEffect, useState } from "react";
import CreatePost from "../components/post/CreatePost";
import PostModal from "../components/post/PostModal";
import AllPosts from "../components/post/AllPosts";
import { useGetAllPostsQuery, useGetUserQuery } from "../../api/authApi";

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

    const handleLogOut = () => {
        setTimeout(() => {
            localStorage.removeItem("userInfo");
            dispatch(logOutUser());
        }, 100)
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
        <div className="container mx-auto">
            <div className="flex gap-x-5 mb-10">
                {
                    !userInfo && <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                }

                <Link to="/profile" className="border p-2 rounded-lg">User: {userInfo.firstname + " " + userInfo.lastname} </Link>

                {userInfo && <button onClick={handleLogOut} className="bg-[tomato] px-3 py-1 rounded-lg cursor-pointer hover:bg-orange-800 transition">Log Out</button>}
            </div>

            {/* ---- Post Creation ---- */}
            <div className="w-1/2 mb-5">
                <CreatePost onOpenModal={openPostModal} user={userInfo} />

                {isPostModalOpen && <PostModal onClose={closePostModal} setPosts={setPosts} />}
            </div>

            {/* ---- All Posts ---- */}
            {
                posts.length > 0 && <AllPosts posts={posts} setPosts={setPosts} />
            }
        </div>
    )
}

export default HomePage