import { Link } from "react-router-dom";
import defaultAvatar from "../../../public/default images/avatar.png"
import { formatDistance } from 'date-fns'
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegThumbsUp } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import Reacts from "./Reacts";
import { useState } from "react";
import { useRef } from "react";

const Post = ({ post }) => {
    const [showReacts, setShowReacts] = useState(false);
    const { text, type, user, background, comments, images } = post;

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });
    const timerRef = useRef(null);

    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
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
                        <Link to={`/profile/${user.username}`}>{user.firstname + " " + user.lastname}</Link>

                        <span className="block text-sm text-primary">{postedTime}</span>
                    </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-text-secondary">
                    <HiDotsHorizontal className="cursor-pointer text-xl" />
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
                                backgroundPositionX: "center",
                                backgroundPositionY: "center"
                            }}
                            className="h-[400px] w-full flex items-center justify-center text-3xl font-bold rounded-[var(--radius-card)]"
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
                                            className="w-1/2 h-[300px] object-cover p-1"
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
                    className="flex items-center justify-center gap-2 relative w-1/3 text-center cursor-pointer hover:bg-primary/10 p-2 rounded-lg transition-all"
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

                <div className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/10 p-2 rounded-lg transition-all">
                    <FaRegComment />
                    <span>Comments</span>
                </div>

                <div className="flex items-center justify-center gap-2 w-1/3 text-center cursor-pointer hover:bg-primary/10 p-2 rounded-lg transition-all">
                    <IoMdShareAlt size={20} />
                    <span>Shares</span>
                </div>
            </div>


        </div>
    )
}

export default Post