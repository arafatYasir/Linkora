import { useSelector } from "react-redux";
import { useGetUserPostsQuery } from "../../../api/authApi"
import { useState } from "react";
import CreatePost from "../post/CreatePost";
import PostModal from "../post/PostModal";
import Post from "../post/Post"

const ProfileItemsRight = ({ user }) => {
    const { data: posts } = useGetUserPostsQuery(user._id);

    // States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Functions
    const openPostModal = () => {
        setIsPostModalOpen(true);
    }

    const closePostModal = () => {
        setIsPostModalOpen(false);
    }

    return (
        <div className="col-span-2">
            {/* ---- Post Creation feature only if the same user profile ---- */}
            {
                userInfo.id === user._id && (
                    <div className="w-full mb-5">
                        <CreatePost onOpenModal={openPostModal} user={userInfo} />

                        {isPostModalOpen && <PostModal onClose={closePostModal} />}
                    </div>
                )
            }

            {/* ---- User Posts ---- */}
            {
                posts && (
                    <ul className="space-y-5">
                        {
                            posts.map(post => (
                                <Post key={post._id} post={post} />
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default ProfileItemsRight