import { useSelector } from "react-redux";
import defaultAvatar from "../../../public/default images/avatar.png"
import { MdEmojiEmotions } from 'react-icons/md';
import { LuFiles } from 'react-icons/lu';
import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { useCommentPostMutation } from "../../../api/authApi";

const CreateComment = ({ commentText, setCommentText, setAllComments, commentFile, setCommentFile, commentRef, postId }) => {
    // States
    // const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Commenting API
    const [commentPost, { isLoading: isCommenting }] = useCommentPostMutation();

    // Extra hooks
    const fileInputRef = useRef(null);

    // Functions
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (file.size > 1024 * 1024 * 10) {
            alert("File size can't be more than 10 MB.");
            return;
        }

        setCommentFile(file);
    }

    const handleComment = async () => {
        if (commentText.trim() === "" && commentFile === null) return;

        try {
            if (commentFile !== null) {

            }
            else {
                const commentResponse = await commentPost({
                    comment: commentText,
                    image: null,
                    postId
                }).unwrap();

                if (commentResponse.status === "OK") {
                    setCommentText("");
                    setCommentFile(null);
                    setAllComments(commentResponse.comments);
                }
            }
        } catch (e) {
            console.log("ERROR while commenting: ", e);
        }
    }

    return (
        <div className="mt-1 border-t pt-2 px-4 pb-2 border-[var(--color-border)]">
            <div className="flex items-start justify-between gap-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                        src={userInfo.profilePicture || defaultAvatar}
                        alt={userInfo.firstname + " " + userInfo.lastname + "Profile Picture"}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full relative">
                    {/* File Input */}
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileUpload}
                    />
                    {/* Text Input */}
                    <textarea
                        type="text"
                        placeholder={`${userInfo.firstname} write a public comment...`}
                        className="w-full border border-[var(--color-border)] pt-[6px] pb-[50px] px-4 rounded-2xl focus:outline-none resize-none"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        ref={commentRef}
                        onKeyUp={(e) => e.key === "Enter" ? handleComment() : null}
                    />

                    <div className="flex justify-between w-[95%] absolute bottom-7 left-3 translate-y-1/2">
                        <div className="flex items-center">
                            <button className="p-2 hover:bg-border rounded-full flex items-center justify-center cursor-pointer">
                                <MdEmojiEmotions size={18} />
                            </button>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="p-2 hover:bg-border rounded-full flex items-center justify-cente cursor-pointer"
                            >
                                <LuFiles size={18} />
                            </button>
                        </div>

                        {
                            isCommenting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-[18px] h-[18px] animate-spin rounded-full border-border border-[3px] border-t-[var(--color-primary)]"></div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleComment}
                                    className="p-2 hover:bg-border rounded-full flex items-center justify-center cursor-pointer"
                                >
                                    <PiPaperPlaneRightFill size={18} />
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* ---- File Preview ---- */}
            {
                commentFile && (
                    <div className="w-30 h-30 mt-2 overflow-hidden relative left-16 rounded-xl group">
                        {
                            commentFile.type.startsWith("image") ? (
                                <img src={URL.createObjectURL(commentFile)} alt="Preview" className="object-cover w-full h-full group-hover:opacity-40" />
                            ) : commentFile.type.startsWith("video") ? (
                                <video src={URL.createObjectURL(commentFile)} autoPlay={false} controls className="w-full h-full"></video>
                            ) : <></>
                        }


                        {/* Close Icon */}
                        <FaTimes size={18} className="text-bg bg-text-primary rounded-full absolute top-1 right-1 cursor-pointer p-0.5" onClick={() => setCommentFile(null)} />
                    </div>
                )
            }
        </div >
    )
}

export default CreateComment