import { useSelector } from "react-redux"
import { postOptions } from "../../constants/postOptions"
import PostOption from "./PostOption";
import { useState } from "react";
import { useDeletePostMutation, useSavePostMutation } from "../../../api/authApi"
import { useDispatch } from "react-redux";
import { postDelete } from "../../slices/postsSlice";
import ConfirmationModal from "../common/ConfirmationModal";
import { toast } from "react-toastify"
import { postActionTypes } from "../../constants/postActionTypes";

const PostOptions = ({ user, postId, onClose }) => {
    // States
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalHeading, setModalHeading] = useState("");
    const [modalText, setModalText] = useState("");
    const [confirm, setConfirm] = useState(null);

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
            
            toast.success("Post saved!");
            onClose();
        } catch (e) {
            console.error("Error while saving post", e);
            toast.error("Failed to save post");
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

            toast.success("Post deleted!");
            onClose();
        } catch (e) {
            console.error("Error while deleting post", e);
            toast.error("Failed to delete post");
        } finally {
            setLoading(false);
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + `/posts/${postId}`);
        toast.success("Link copied to clipboard!");
        onClose();
    }

    const handleClick = (actionType) => {
        setShowModal(true);

        if (actionType === "Save Post") {
            setConfirm(() => handleSavePost);
            setModalHeading(postActionTypes[actionType].heading);
            setModalText(postActionTypes[actionType].text);
        } else if (actionType === "Delete Post") {
            setConfirm(() => handleDeletePost);
            setModalHeading(postActionTypes[actionType].heading);
            setModalText(postActionTypes[actionType].text);
        }
        else if(actionType === "Copy Link") {
            handleCopyLink();
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
                    heading={modalHeading}
                    text={modalText}
                    onConfirm={confirm}
                    onCancel={() => setShowModal(false)}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default PostOptions