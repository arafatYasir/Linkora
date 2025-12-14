import { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdLink } from "react-icons/io";
import { FaGlobeAmericas, FaCaretDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import defaultPhoto from "/default images/avatar.png";
import { useCreatePostMutation, useSharePostMutation } from "../../../api/authApi";
import { addPost } from "../../slices/postsSlice";

const ShareModal = ({ onClose, postLink, postId }) => {
    // States
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    // Redux states
    const { userInfo } = useSelector((state) => state.auth);

    // Extra hooks
    const modalRef = useRef(null);

    // Post sharing api
    const [sharePost] = useSharePostMutation();

    // Post creating api
    const [createPost] = useCreatePostMutation();

    // Close modal when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + postLink);
        toast.success("Link copied to clipboard!");
    };

    const handleSharePost = async () => {
        try {
            setLoading(true);

            // First save the post to the database
            const sharePostResponse = await sharePost({ postId, caption }).unwrap();

            // If post share is successful then create a "post"
            if (sharePostResponse.message === "OK") {
                const createPostResponse = await createPost({
                    type: "shared-post",
                    images: [],
                    text: caption,
                    background: null,
                    user: userInfo._id,
                    sharedPost: postId
                });

                // Extracting post and pushing the userInfo on the post
                const post = { ...createPostResponse.post };
                post.user = userInfo;

                // Adding the post in redux store
                dispatch(addPost({
                    ...post,
                    reactionsCount: {
                        Like: 0,
                        Love: 0,
                        Haha: 0,
                        Wow: 0,
                        Sad: 0,
                        Angry: 0
                    },
                    totalReactions: 0,
                    usersReaction: null,
                    comments: []
                }));
            }
        } catch (e) {
            toast.error("Failed to share the post!");
            console.error(e);
        } finally {
            setLoading(false);
        }

        // Close modal
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div
                ref={modalRef}
                className="w-full max-w-lg rounded-xl shadow-lg bg-surface border border-border overflow-hidden transform transition-all"
            >
                {/* ---- Header ---- */}
                <div className="relative flex items-center justify-center py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        Share Post
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary transition-colors active:scale-95"
                        aria-label="Close"
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        {/* Profile Picture & Name */}
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                                src={userInfo.profilePicture || defaultPhoto}
                                alt={userInfo.firstname + " " + userInfo.lastname}
                                className="w-full h-full object-cover border"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-text-primary leading-tight">
                                {userInfo.firstname + " " + userInfo.lastname}
                            </span>

                            {/* View Badge/Dropdown */}
                            <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-bg/50 rounded-md border border-border text-sm text-text-secondary cursor-pointer hover:bg-border/50 transition-colors">
                                <FaGlobeAmericas size={12} />
                                <span>Public</span>
                                <FaCaretDown size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="w-full mb-4">
                        <textarea
                            placeholder="Say something about this..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            style={{ lineHeight: "22px" }}
                            className="w-full min-h-[140px] bg-transparent text-text-primary placeholder:text-text-secondary/60 resize-none outline-none border-none focus:ring-0 p-0 custom-scrollbar"
                            autoFocus
                        />
                    </div>

                    {/* Actions / Copy Link */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium px-2 py-1 rounded-lg bg-border/50 hover:bg-border cursor-pointer"
                        >
                            <IoMdLink size={20} />
                            <span>Copy link</span>
                        </button>
                    </div>
                </div>

                {/* ---- Footer / Share Button ---- */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleSharePost}
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-[15px] hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sharing..." : "Share now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;