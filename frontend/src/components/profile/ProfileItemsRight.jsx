import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CreatePost from "../post/CreatePost";
import PostModal from "../post/PostModal";
import AllPosts from "../post/AllPosts";
import PostViewControl from "../post/PostViewControl";
import GridPosts from "../post/GridPosts";

const ProfileItemsRight = ({ user, posts }) => {
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
    }, [isPostModalOpen]);

    return (
        <div className="col-span-3">
            {/* ---- Post Creation feature only if the same user profile ---- */}
            {
                userInfo._id === user?._id && (
                    <div className="w-full mb-5">
                        <CreatePost onOpenModal={openPostModal} user={user} />

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
                ((posts && posts?.length > 0) && viewMethod === "list") ? (
                    <AllPosts posts={posts} />
                )
                : ((posts && posts?.length > 0) && viewMethod === "grid") ? (
                    <GridPosts posts={posts} />
                ) : <h2 className="text-xl text-center">No posts available for this user</h2>
            }
        </div>
    )
}

export default ProfileItemsRight