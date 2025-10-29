import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logOutUser } from "../slices/authSlice";
import { useState } from "react";
import CreatePost from "../components/post/CreatePost";
import PostModal from "../components/post/PostModal";
import { useGetAllPostsQuery } from "../../api/authApi";

const HomePage = () => {
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Fetching posts
    const {data} = useGetAllPostsQuery();

    console.log(data);

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

    return (
        <div className="container mx-auto">
            <div className="flex gap-x-5 mb-10">
                {
                    !userInfo && <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                }

                <p className="border p-2 rounded-lg">User: {userInfo.firstname + " " + userInfo.lastname} </p>

                {userInfo && <button onClick={handleLogOut} className="bg-[tomato] px-3 py-1 rounded-lg cursor-pointer hover:bg-orange-800 transition">Log Out</button>}
            </div>

            {/* ---- Post ---- */}
            <div>
                <CreatePost onOpenModal={openPostModal} user={userInfo} />

                {isPostModalOpen && <PostModal onClose={closePostModal} />}
            </div>

            {/* ---- All Posts ---- */}
            <div>

            </div>
        </div>
    )
}

export default HomePage