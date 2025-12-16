import { useSelector } from "react-redux"
import { postOptions } from "../../constants/postOptions"
import PostOption from "./PostOption";
import { useState } from "react";
import { useDeletePostMutation, useSavePostMutation } from "../../../api/authApi"
import { useDispatch } from "react-redux";
import { postDelete } from "../../slices/postsSlice";
import ConfirmationModal from "../common/ConfirmationModal";

const PostOptions = ({ user, postId, onClose }) => {
    // States
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    const userType = userInfo._id === user._id ? "creator" : "visitor";

    // Extra hooks
    const dispatch = useDispatch();

    // Post saving api
    const [savePost] = useSavePostMutation();

    // Post deleting api
    const [deletePost] = useDeletePostMutation();

    const handleSavePost = async () => {
        setLoading(true);
        try {
            await savePost(postId).unwrap();
        } catch (e) {
            console.error("Error while saving post", e);
        } finally {
            setLoading(false);
        }
    }

    const handleDeletePost = async () => {
        setLoading(true);
        try {
            const res = await deletePost(postId).unwrap();

            if (res.status === "OK") {
                dispatch(postDelete(postId));
            }
        } catch (e) {
            console.error("Error while deleting post", e);
        } finally {
            setLoading(false);
        }
    }

    const handleClick = (actionType) => {
        setShowModal(true);

        return;

        if (actionType === "Save Post") {
            handleSavePost();
        } else if (actionType === "Delete Post") {
            handleDeletePost();
        }
    }

    return (
        <div
            className="absolute z-50 top-10 right-0 w-[300px] px-3 py-4 bg-[var(--color-bg)] rounded-lg shadow-lg border border-[var(--color-border)] flex flex-col"
        >
            {
                postOptions[userType].map(option => (
                    <PostOption key={option.id} option={option} handleClick={handleClick} />
                ))
            }

            {/* ---- Confirmation Modal ---- */}
            {showModal && (
                <ConfirmationModal
                    text="Are you sure you want to delete this post?"
                    onConfirm={handleDeletePost}
                    onCancel={() => setShowModal(false)}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default PostOptions