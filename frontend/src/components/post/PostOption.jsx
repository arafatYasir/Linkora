import { useState } from "react";
import { useDeletePostMutation, useSavePostMutation } from "../../../api/authApi"
import { useDispatch } from "react-redux";
import { postDelete } from "../../slices/postsSlice";

const PostOption = ({ option, postId }) => {
    // States
    const [loading, setLoading] = useState(false);

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
                dispatch(postDelete(postId.toString()));
            }
        } catch (e) {
            console.error("Error while deleting post", e);
        } finally {
            setLoading(false);
        }
    }

    const handleClick = () => {
        if (option.name === "Save Post") {
            handleSavePost();
        } else if (option.name === "Delete Post") {
            handleDeletePost();
        }
    }

    return (
        <button onClick={handleClick} className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-2 rounded-md transition-all duration-250">
            {
                loading ? <span>Loading...</span> : (
                    <>
                        <option.icon size={20} />
                        <span>{option.name}</span>
                    </>
                )
            }
        </button>
    )
}

export default PostOption