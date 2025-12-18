import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import defaultAvatar from "/public/default images/avatar.png";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import PostOptions from "./PostOptions";

const PostModalView = ({ post, onClose }) => {
    // States
    const [showOptions, setShowOptions] = useState(false);

    const {_id, type, user} = post;

    // Extra hooks
    const modalRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div
                ref={modalRef}
                className="w-full max-w-2xl rounded-xl shadow-lg bg-surface border border-border transform transition-all"
            >
                {/* ---- Headeer ---- */}
                <div className="relative flex items-center justify-center py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{user.firstname + " " + user.lastname}'s Post</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary transition-colors active:scale-95"
                        aria-label="Close"
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div>
                    {/* ---- Post Header ---- */}
                    <div className="flex items-center justify-between border-b pb-2 px-4 pt-4 border-b-[var(--color-border)]">
                        <div className="flex items-center gap-x-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <Link to={`/profile/${user.username}`}>
                                    <img
                                        src={user.profilePicture || defaultAvatar}
                                        alt={`${user.firstname + " " + user.lastname}'s profile picture`}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>

                            <div>
                                <p>
                                    <Link
                                        to={`/profile/${user.username}`}
                                        className="hover:underline font-semibold"
                                    >
                                        {user.firstname + " " + user.lastname}
                                    </Link>
                                    <span className="text-gray-400">
                                        {type === "profile-picture" && ` updated ${user.gender === "Male" ? "his" : "her"} profile picture.`}

                                        {type === "cover-photo" && ` updated ${user.gender === "Male" ? "his" : "her"} cover photo.`}
                                    </span>
                                </p>

                                <span className="block text-[13px] font-semibold text-primary mt-1.5">{postedTime}</span>
                            </div>
                        </div>
                        <div className="relative" ref={optionsRef}>
                            <div
                                className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-all hover:bg-bg"
                                onClick={() => setShowOptions(prev => !prev)}
                            >
                                <HiDotsHorizontal className="cursor-pointer text-xl" />
                            </div>
                            {/* ---- Post Options ---- */}
                            {
                                showOptions && <PostOptions user={user} postId={_id} onClose={() => setShowOptions(false)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModalView