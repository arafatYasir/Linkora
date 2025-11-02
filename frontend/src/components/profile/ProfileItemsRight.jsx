import { useSelector } from "react-redux";
import { useGetUserPostsQuery } from "../../../api/authApi"
import { useEffect, useState } from "react";
import CreatePost from "../post/CreatePost";
import PostModal from "../post/PostModal";
import Post from "../post/Post"
import AllPosts from "../post/AllPosts";
import PostViewControl from "../post/PostViewControl";

const ProfileItemsRight = ({ user }) => {
    const { data: posts } = useGetUserPostsQuery(user._id);

    // States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [viewMethod, setViewMethod] = useState("list");

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Functions
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
    }, [isPostModalOpen])

    return (
        <div className="col-span-2">
            {/* ---- Post Creation feature only if the same user profile ---- */}
            {
                userInfo.id === user._id && (
                    <div className="w-full mb-5">
                        <CreatePost onOpenModal={openPostModal} user={userInfo} />

                        {isPostModalOpen && <PostModal onClose={closePostModal} />}

                        {/* ---- Post View ---- */}
                        <div className="mt-5">
                            <PostViewControl viewMethod={viewMethod} setViewMethod={setViewMethod} />
                        </div>
                    </div>
                )
            }

            {/* ---- User Posts ---- */}
            {
                posts && <AllPosts posts={posts} />
            }
        </div>
    )
}

export default ProfileItemsRight