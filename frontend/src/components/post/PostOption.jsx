import { useSavePostMutation } from "../../../api/authApi"

const PostOption = ({ option, postId }) => {
    const [savePost, { isLoading: isSaving }] = useSavePostMutation();

    const handleSavePost = async () => {
        try {
            await savePost(postId).unwrap();
        } catch (e) {
            console.error("Error while saving post", e);
        }
    }

    return (
        <button onClick={option.name === "Save Post" ? handleSavePost : null} className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250">
            {
                isSaving ? <span>Saving Post...</span> : (
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