import { Link } from "react-router-dom";
import defaultAvatar from "../../../public/default images/avatar.png"
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegThumbsUp } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import Reacts from "./Reacts";
import CreateComment from "./CreateComment";
import Comments from "./Comments";
import PostOptions from "./PostOptions";
import ShareModal from "./ShareModal";

const RegularPost = ({ user,
    type,
    postedTime,
    text,
    images,
    background,
    _id,
    allReactionCounts,
    totalReacts,
    optionsRef,
    showReacts,
    setShowReacts,
    showOptions,
    setShowOptions,
    // Add the missing props below:
    react,
    shares,
    timerRef,
    handleReact,
    reactionColors,
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    commentFile,
    setCommentFile,
    allComments,
    showShareModal,
    setShowShareModal,
    commentRef,
    setAllComments
}) => {
    return (
        <li className="w-full bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] transition-[var(--transition-default)]">
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
                                    background: `url("${background}")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    lineHeight: "36px"
                                }}
                                className="h-[400px] w-full text-white text-center flex items-center justify-center text-3xl font-bold px-2"
                            >
                                {text}
                            </div>
                        ) : (
                            <div className="text-lg">
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
                    className="flex items-center justify-center gap-2 relative w-1/3 h-8 text-center cursor-pointer hover:bg-primary/30 rounded-lg transition-all duration-250"
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
                    className="flex items-center justify-center gap-2 w-1/3 h-8 text-center cursor-pointer hover:bg-primary/30 rounded-lg transition-all duration-250"
                    onClick={() => {
                        setShowComments(prev => !prev);
                    }}
                >
                    <FaRegComment />
                    <span>Comment</span>
                </button>

                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center justify-center gap-2 w-1/3 h-8 text-center cursor-pointer hover:bg-primary/30 rounded-lg transition-all">
                    <IoMdShareAlt size={20} />
                    <span>Share</span>
                </button>
            </div>

            {/* ---- Share Modal ---- */}
            {
                showShareModal && <ShareModal onClose={() => setShowShareModal(false)} postLink={`/posts/${_id}`} postId={_id} originalPostedTime={postedTime} />
            }

            {/* ---- Comments ---- */}
            {
                showComments && <CreateComment commentText={commentText} setCommentText={setCommentText} setAllComments={setAllComments} commentFile={commentFile} setCommentFile={setCommentFile} commentRef={commentRef} postId={_id} />
            }
            {
                allComments.length > 0 && <Comments comments={allComments} />
            }
        </li>
    )
}

export default RegularPost