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
import { useReactPostMutation } from "../../../api/authApi";

const reactionColors = {
    Like: "#2078F4",
    Love: "#F33E58",
    Haha: "#F7B125",
    Wow: "#F7B125",
    Sad: "#F7B125",
    Angry: "#E9710F"
};

const Post = ({ post }) => {
    // States
    const [showReacts, setShowReacts] = useState(false);
    const [react, setReact] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [comment, setComment] = useState("");
    const [commentFile, setCommentFile] = useState(null);

    // Extra hooks
    const commentRef = useRef(null);
    const timerRef = useRef(null);
    const optionsRef = useRef(null);

    // Extracting data from post
    const { _id, text, type, user, background, comments, images, usersReaction, reactionsCount, totalReactions } = post;

    // Reaction api
    const [reactPost] = useReactPostMutation();

    useEffect(() => {
        if (showComments) commentRef.current.focus();
    }, [showComments]);

    // useEffect to sync and set the usersReaction to state
    useEffect(() => {
        if (usersReaction?.react) {
            setReact(usersReaction?.react);
        }
    }, [usersReaction?.react]);

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
    }, []);

    // Functions
    const handleReact = async (reactType) => {
        const prevReact = react;
        setReact(prev => prev === reactType ? null : reactType);

        try {
            await reactPost({ react: reactType, postId: _id }).unwrap();
            setShowReacts(false);
        } catch (e) {
            console.error("Error while reacting post", e);
            setReact(prevReact);
        }
    }

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        <li className="w-full max-w-[640px] bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] transition-[var(--transition-default)]">
            {/* ---- Post Heading ---- */}
            <div className="flex items-center justify-between border-b pb-2 px-4 pt-4 border-b-[var(--color-border)]">
                <div className="flex items-center gap-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Link to={`/profile/${user.username}`}>
                            <img
                                src={user.profilePicture || defaultAvatar}
                                alt={user.firstname + " " + user.lastname} className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>

                    <div>
                        <p>
                            <Link
                                to={`/profile/${user.username}`}
                                className="hover:underline"
                            >
                                {user.firstname + " " + user.lastname}
                            </Link>
                            <span className="text-gray-400">
                                {type === "profile-picture" && ` updated ${user.gender === "Male" ? "his" : "her"} profile picture.`}

                                {type === "cover-photo" && ` updated ${user.gender === "Male" ? "his" : "her"} cover photo.`}
                            </span>
                        </p>

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
                <div className="mb-2">
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
                                <p className="px-4">{text}</p>

                                {images && images.length > 0 && (
                                    <div className="flex flex-wrap mt-4">
                                        {images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${user.firstname} ${user.lastname} post image ${index + 1}`}
                                                className={`${type === "profile-picture" ? "w-[400px] h-[400px] mx-auto rounded-full" : "w-full max-h-[600px]"} object-cover`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
                {/* ---- Other's Reactions & Count ---- */}
                <div className="px-4 mb-2 flex items-center gap-x-1.5 cursor-pointer">
                    {/* ---- Reactions ---- */}
                    <div className="flex items-center space-x-[-2px]">
                        {Object.keys(reactionsCount).map((react, index) => (
                            <img
                                key={index}
                                src={`/reacts/${react.toLowerCase()}.svg`}
                                alt={react}
                                className="w-5 h-5"
                            />
                        ))}
                    </div>

                    {/* ---- Count ---- */}
                    <span>{totalReactions ? totalReactions : ""}</span>
                </div>
            </div>

            {/* ---- Post Footer ---- */}
            <div className="relative flex items-center justify-between border-t pt-2 px-4 pb-1 border-t-[var(--color-border)]">
                {/* ---- Show reactions on hover ---- */}
                {showReacts && <Reacts setShowReacts={setShowReacts} timerRef={timerRef} handleReact={handleReact} />}

                {/* ---- Buttons ---- */}
                <button
                    className="flex items-center justify-center gap-2 relative w-1/3 text-center cursor-pointer hover:bg-primary/30 py-1.5 rounded-lg transition-all duration-250"
                    onMouseOver={() => {
                        clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => setShowReacts(true), 200)
                    }}
                    onMouseLeave={() => {
                        timerRef.current = setTimeout(() => setShowReacts(false), 1000)
                    }}
                    onClick={() => handleReact(react || "Like")}
                >
                    {
                        react ? (
                            <img
                                src={`/reacts/${react.toLowerCase()}.svg`}
                                className="w-5 h-5"
                            />
                        ) : (
                            <FaRegThumbsUp />
                        )
                    }
                    <span
                        className={react ? "font-medium" : ""}
                        style={{
                            color: reactionColors[react] || ""
                        }}
                    >{react || "Like"}</span>
                </button>

                <button
                    className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/30 py-1.5 rounded-lg transition-all duration-250"
                    onClick={() => {
                        setShowComments(prev => !prev);
                    }}
                >
                    <FaRegComment />
                    <span>Comments</span>
                </button>

                <button className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/30 py-1.5 rounded-lg transition-all">
                    <IoMdShareAlt size={20} />
                    <span>Shares</span>
                </button>
            </div>

            {/* ---- Comments ---- */}
            {
                showComments && <CreateComment comment={comment} setComment={setComment} commentFile={commentFile} setCommentFile={setCommentFile} commentRef={commentRef} />
            }
        </li>
    )
}

export default Post