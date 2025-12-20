import { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdShareAlt } from "react-icons/io";
import defaultAvatar from "/public/default images/avatar.png";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import PostOptions from "./PostOptions";
import Reacts from "./Reacts";
import { useReactPostMutation } from "../../../api/authApi";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import ShareModal from "./ShareModal";
import CreateComment from "./CreateComment";
import Comments from "./Comments";

const reactionColors = {
    Like: "#2078F4",
    Love: "#F33E58",
    Haha: "#F7B125",
    Wow: "#F7B125",
    Sad: "#F7B125",
    Angry: "#E9710F"
};

const PostModalView = ({ post, onClose }) => {
    // States
    const [showReacts, setShowReacts] = useState(false);
    const [react, setReact] = useState(null);
    const [totalReacts, setTotalReacts] = useState(null);
    const [allReactionCounts, setAllReactionCounts] = useState(null);
    const [isReacting, setIsReacting] = useState(false);

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentFile, setCommentFile] = useState(null);
    const [allComments, setAllComments] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);

    const [showOptions, setShowOptions] = useState(false);

    const { _id, text, type, user, background, comments, images, usersReaction, sharedPost, reactionsCount, totalReactions, shares } = post;

    // Reaction api
    const [reactPost] = useReactPostMutation();

    // Extra hooks
    const modalRef = useRef(null);
    const optionsRef = useRef(null);
    const timerRef = useRef(null);
    const commentRef = useRef(null);

    useEffect(() => {
        if (totalReactions) {
            setTotalReacts(totalReactions);
        }
        if (reactionsCount) {
            setAllReactionCounts(reactionsCount);
        }
    }, [reactionsCount, totalReactions]);

    useEffect(() => {
        if (showComments) commentRef.current.focus();
    }, [showComments]);

    useEffect(() => {
        if (comments.length > 0) setAllComments(comments);
    }, [comments]);

    // useEffect to sync and set the usersReaction to state
    useEffect(() => {
        if (usersReaction?.react) {
            setReact(usersReaction?.react);
        }
    }, [usersReaction?.react]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Functions
    const handleReact = async (reactType) => {
        if (isReacting) return;

        setIsReacting(true);

        const prevReact = react;
        const prevAllReactionCounts = allReactionCounts;
        const prevTotalReacts = totalReacts;

        // Setting local state values for optimistic ui updates
        setReact(prev => prev === reactType ? null : reactType);
        if (prevReact === reactType) {
            setAllReactionCounts(prev => ({
                ...prev,
                [reactType]: prev[reactType] - 1
            }));
            setTotalReacts(prev => prev - 1);
        }
        else {
            // Handling both add and update reaction. If user is adding a completely new reaction then prevReact will be null and it will be ignored. So in that case it will add 1 to the new reaction. But if the user had some other reaction at first and now he is changing the reaction to something else then the prevReact will hold the key of the previous react and previous react count will be decreased by 1. And as always the new react count will be increase by 1.
            setAllReactionCounts(prev => ({
                ...prev,
                ...(prevReact && { [prevReact]: (prev[prevReact] || 1) - 1 }),
                ...(reactType && { [reactType]: (prev[reactType] || 0) + 1 })
            }));

            // If the user had some previous react and now updating it then the react count doesnt change at all
            if (prevReact === null) setTotalReacts(prev => prev + 1);
        }

        try {
            await reactPost({ react: reactType, postId: _id }).unwrap();
            setShowReacts(false);
        } catch (e) {
            console.error("Error while reacting post", e);
            // Reverting back to previous state
            setReact(prevReact);
            setAllReactionCounts(prevAllReactionCounts);
            setTotalReacts(prevTotalReacts);
        } finally {
            setIsReacting(false);
        }
    }

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div
                ref={modalRef}
                className="w-full max-w-2xl rounded-xl bg-surface border border-border transform transition-all"
            >
                {/* ---- Header ---- */}
                <div className="sticky z-50 top-0 left-0 flex items-center justify-center py-4 rounded-t-xl bg-surface border-b border-border">
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
                <div className="max-h-[650px] overflow-y-auto scroll-smooth custom-scrollbar">
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

                    {/* ---- Post Body ---- */}
                    <div className="mt-4">
                        <div className="mb-2">
                            {
                                background ? (
                                    <div
                                        style={{
                                            backgroundImage: `url(${background})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            lineHeight: "36px"
                                        }}
                                        className="w-full aspect-video text-white text-center flex items-center justify-center text-3xl font-bold px-2"
                                    >
                                        {text}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="px-4 text-[15px]" style={{ lineHeight: "20px" }}>{text}</p>

                                        {images && images.length > 0 && (
                                            <div className="flex flex-wrap mt-4">
                                                {images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`${user.firstname} ${user.lastname}'s post image ${index + 1}`}
                                                        className={`${type === "profile-picture" ? "w-full h-full" : "w-full"} object-cover`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>

                        {/* ---- Reactions/Comments/Shares ---- */}
                        <div className="flex items-center justify-between mb-2 px-4">
                            {/* ---- Reactions & Count ---- */}
                            <div className="flex items-center gap-x-1.5">
                                {/* ---- Reactions ---- */}
                                <div className="flex items-center space-x-[-2px]">
                                    {allReactionCounts && Object.keys(allReactionCounts).map((react, index) => {
                                        if (allReactionCounts[react] > 0) {
                                            return (
                                                <img
                                                    key={index}
                                                    src={`/reacts/${react.toLowerCase()}.svg`}
                                                    alt={react}
                                                    className="w-5 h-5"
                                                />
                                            )
                                        }
                                    })}
                                </div>

                                {/* ---- Count ---- */}
                                <span>{totalReacts || ""}</span>
                            </div>

                            <p className={`flex ${shares.length > 0 ? "gap-4" : ""}`}>
                                {/* ---- Comments & Count ---- */}
                                <span>{allComments.length > 0 ? `${allComments.length} comment${allComments.length > 1 ? "s" : ""}` : ""}</span>

                                {/* ---- Shares & Count ---- */}
                                <span>{shares.length > 0 ? `${shares.length} share${shares.length > 1 ? "s" : ""}` : ""}</span>
                            </p>
                        </div>
                    </div>

                    {/* ---- Post Footer ---- */}
                    <div className="relative flex items-center justify-between border-t pt-2 px-4 pb-1 border-t-[var(--color-border)]">
                        {/* ---- Show reactions on hover ---- */}
                        {showReacts && <Reacts setShowReacts={setShowReacts} timerRef={timerRef} handleReact={handleReact} />}

                        {/* ---- Buttons ---- */}
                        <button
                            className="flex items-center justify-center gap-2 relative w-1/3 h-8 text-center cursor-pointer hover:bg-bg rounded-lg transition-all duration-250"
                            onMouseEnter={() => {
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
                            className="flex items-center justify-center gap-2 w-1/3 h-8 text-center cursor-pointer hover:bg-bg rounded-lg transition-all duration-250"
                            onClick={() => {
                                setShowComments(prev => !prev);
                            }}
                        >
                            <FaRegComment />
                            <span>Comment</span>
                        </button>

                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center justify-center gap-2 w-1/3 h-8 text-center cursor-pointer hover:bg-bg rounded-lg transition-all">
                            <IoMdShareAlt size={20} />
                            <span>Share</span>
                        </button>
                    </div>

                    {/* ---- Comments ---- */}
                    {
                        showComments && <CreateComment commentText={commentText} setCommentText={setCommentText} setAllComments={setAllComments} commentFile={commentFile} setCommentFile={setCommentFile} commentRef={commentRef} postId={_id} />
                    }
                    {
                        allComments.length > 0 && <Comments comments={allComments} />
                    }
                </div>
            </div>

            {/* ---- Share Modal ---- */}
            {
                showShareModal && <ShareModal onClose={() => setShowShareModal(false)} postLink={`/posts/${_id}`} postId={_id} originalPostedTime={postedTime} />
            }
        </div>
    )
}

export default PostModalView