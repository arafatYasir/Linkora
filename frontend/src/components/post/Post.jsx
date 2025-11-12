import { Link } from "react-router-dom";
import defaultAvatar from "../../../public/default images/avatar.png"
import { formatDistance } from 'date-fns'
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegThumbsUp } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import Reacts from "./Reacts";
import { useEffect, useState } from "react";
import { useRef } from "react";
import CreateComment from "./CreateComment";
import PostOptions from "./PostOptions";

const Post = ({ post }) => {
    // States
    const [showReacts, setShowReacts] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [comment, setComment] = useState("");
    const [commentFile, setCommentFile] = useState(null);

    // Extra hooks
    const commentRef = useRef(null);
    const timerRef = useRef(null);
    const optionsRef = useRef(null);

    // Extracting data from post
    const { text, type, user, background, comments, images } = post;

    useEffect(() => {
        if (showComments) commentRef.current.focus();
    }, [showComments]);

    useEffect(() => {
        const handleCloseOptions = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleCloseOptions);

        return () => {
            document.removeEventListener("mousedown", handleCloseOptions);
        }
    }, [])

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        <li className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
            {/* ---- Post Heading ---- */}
            <div className="flex items-center justify-between border-b pb-2 border-b-[var(--color-border)]">
                <div className="flex items-center gap-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Link to={`/profile/${user.username}`}>
                            <img
                                src={user.profilePicture || defaultAvatar}
                                alt={user.firstname + " " + user.lastname} className="w-full object-cover"
                            />
                        </Link>
                    </div>

                    <div>
                        <Link
                            to={`/profile/${user.username}`}
                            className="hover:underline"
                        >
                            <span>{user.firstname + " " + user.lastname}</span>
                            <span>{type === "profile-picture" && " changed profile picture"}</span>
                        </Link>

                        <span className="block text-sm text-primary">{postedTime}</span>
                    </div>
                </div>
                <div className="relative">
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-text-secondary"
                        onClick={() => setShowOptions(prev => !prev)}
                    >
                        <HiDotsHorizontal className="cursor-pointer text-xl" />
                    </div>
                    {/* ---- Post Options ---- */}
                    {
                        showOptions && <PostOptions user={user} optionsRef={optionsRef} />
                    }
                </div>
            </div>

            {/* ---- Post Body ---- */}
            <div className="mt-4">
                {
                    background ? (
                        <div
                            style={{
                                background: `url("${background}")`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            className="h-[400px] w-full text-center flex items-center justify-center text-3xl font-bold"
                        >
                            {text}
                        </div>
                    ) : (
                        <div className="text-lg leading-[1]">
                            <p>{text}</p>

                            {images && images.length > 0 && (
                                <div className="flex flex-wrap mt-4">
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${user.firstname} ${user.lastname} post image ${index + 1}`}
                                            className={`${type === "profile-picture" ? "w-[400px] h-[400px] mx-auto rounded-full" : "w-full max-h-[600px]"} object-cover p-1`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>

            {/* ---- Post Footer ---- */}
            <div className="flex items-center justify-between border-t pt-2 mt-4 border-t-[var(--color-border)]">
                <div
                    className="flex items-center justify-center gap-2 relative w-1/3 text-center cursor-pointer hover:bg-primary/30 p-2 rounded-lg transition-all duration-250"
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => setShowReacts(true), 200)
                    }}
                    onMouseLeave={() => {
                        timerRef.current = setTimeout(() => setShowReacts(false), 500)
                    }}
                >

                    {/* ---- Reactions on hover ---- */}
                    {showReacts && <Reacts setShowReacts={setShowReacts} timerRef={timerRef} />}

                    <FaRegThumbsUp />
                    <span>Like</span>
                </div>

                <div
                    className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/30 p-2 rounded-lg transition-all duration-250"
                    onClick={() => {
                        setShowComments(prev => !prev);
                    }}
                >
                    <FaRegComment />
                    <span>Comments</span>
                </div>

                <div className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/30 p-2 rounded-lg transition-all">
                    <IoMdShareAlt size={20} />
                    <span>Shares</span>
                </div>
            </div>

            {/* ---- Comments ---- */}
            {
                showComments && <CreateComment comment={comment} setComment={setComment} commentFile={commentFile} setCommentFile={setCommentFile} commentRef={commentRef} />
            }
        </li>
    )
}

export default Post