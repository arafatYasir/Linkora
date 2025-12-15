import { Link } from "react-router-dom";
import { formatDistance } from 'date-fns';
import defaultAvatar from "../../../public/default images/avatar.png"
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import Reacts from "./Reacts";
import CreateComment from "./CreateComment";
import Comments from "./Comments";
import PostOptions from "./PostOptions";
import ShareModal from "./ShareModal";

const SharedPost = ({
    user,
    type,
    postedTime,
    text,
    sharedPost,
    _id,
    allReactionCounts,
    totalReacts,
    optionsRef,
    showReacts,
    setShowReacts,
    showOptions,
    setShowOptions,
    react,
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
    setAllComments,
    showShareModal,
    setShowShareModal,
    commentRef
}) => {

    // Check if original post exists
    const isOriginalAvailable = !!sharedPost;
    const originalUser = sharedPost?.user;
    const realPostedTime = isOriginalAvailable ? formatDistance(new Date(sharedPost.createdAt), new Date(), { addSuffix: true }) : "";

    return (
        <li className="w-full bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] transition-[var(--transition-default)]">
            {/* ---- Sharer Header ---- */}
            <div className="flex items-center justify-between border-b pb-2 px-4 pt-4 border-b-[var(--color-border)]">
                <div className="flex items-center gap-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Link to={`/profile/${user.username}`}>
                            <img
                                src={user.profilePicture || defaultAvatar}
                                alt={user.firstname + " " + user.lastname}
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
                            <span className="text-gray-400"> shared a post.</span>
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
                        showOptions && <PostOptions user={user} postId={_id} />
                    }
                </div>
            </div>

            {/* ---- Sharer Caption ---- */}
            {text && (
                <div className="px-4 py-3">
                    <p className="text-[15px]" style={{ lineHeight: "20px" }}>{text}</p>
                </div>
            )}

            {/* ---- Shared Content Container ---- */}
            <div className="mx-4 mb-4 border border-[var(--color-border)] rounded-lg overflow-hidden">
                {isOriginalAvailable ? (
                    <div className="bg-[var(--color-surface)]">
                        {/* ---- Original Post Header ---- */}
                        <div className="flex items-center gap-x-3 p-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Link to={`/profile/${originalUser.username}`}>
                                    <img
                                        src={originalUser.profilePicture || defaultAvatar}
                                        alt={originalUser.firstname + " " + originalUser.lastname}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>

                            <div>
                                <p className="leading-tight">
                                    <Link
                                        to={`/profile/${originalUser.username}`}
                                        className="hover:underline font-semibold text-[15px]"
                                    >
                                        {originalUser.firstname + " " + originalUser.lastname}
                                    </Link>
                                </p>
                                <span className="text-xs text-gray-500 font-medium">{realPostedTime}</span>
                            </div>
                        </div>

                        {/* ---- Original Post Body ---- */}
                        <div>
                            {
                                sharedPost.background ? (
                                    <div
                                        style={{
                                            background: `url("${sharedPost.background}")`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            lineHeight: "36px"
                                        }}
                                        className="h-[300px] w-full text-white text-center flex items-center justify-center text-2xl font-bold px-4"
                                    >
                                        {sharedPost.text}
                                    </div>
                                ) : (
                                    <div className="text-lg">
                                        {sharedPost.text && (
                                            <p className="px-3 pb-3 text-[15px]" style={{ lineHeight: "20px" }}>{sharedPost.text}</p>
                                        )}

                                        {sharedPost.images && sharedPost.images.length > 0 && (
                                            <div className="flex flex-wrap">
                                                {sharedPost.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt="Shared content"
                                                        className="w-full max-h-[500px] object-cover border-t border-[var(--color-border)]"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="p-8 bg-gray-50 text-center">
                        <p className="text-gray-500 font-medium text-lg">This content is currently unavailable</p>
                        <p className="text-gray-400 text-sm mt-1">When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.</p>
                    </div>
                )}
            </div>

            {/* ---- Reactions & Comments Count (For the share) ---- */}
            <div className="flex items-center justify-between mb-2 px-4 mt-2">
                <div className="flex items-center gap-x-1.5">
                    <div className="flex items-center space-x-[-2px]">
                        {allReactionCounts && Object.keys(allReactionCounts).map((reactKey, index) => {
                            if (allReactionCounts[reactKey] > 0) {
                                return (
                                    <img
                                        key={index}
                                        src={`/reacts/${reactKey.toLowerCase()}.svg`}
                                        alt={reactKey}
                                        className="w-5 h-5"
                                    />
                                )
                            }
                        })}
                    </div>
                    <span>{totalReacts ? totalReacts : ""}</span>
                </div>
                <p>{allComments.length > 0 ? `${allComments.length} comments` : ""}</p>
            </div>


            {/* ---- Post Footer (Interaction Buttons) ---- */}
            <div className="relative flex items-center justify-between border-t pt-2 px-4 pb-1 border-t-[var(--color-border)]">
                {showReacts && <Reacts setShowReacts={setShowReacts} timerRef={timerRef} handleReact={handleReact} />}

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
                                alt="Reaction"
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
                showShareModal && <ShareModal onClose={() => setShowShareModal(false)} postLink={`/posts/${_id}`} postId={_id} />
            }

            {/* ---- Comments Section ---- */}
            {
                showComments && <CreateComment commentText={commentText} setCommentText={setCommentText} setAllComments={setAllComments} commentFile={commentFile} setCommentFile={setCommentFile} commentRef={commentRef} postId={_id} />
            }
            {
                allComments.length > 0 && <Comments comments={allComments} />
            }
        </li>
    )
}

export default SharedPost