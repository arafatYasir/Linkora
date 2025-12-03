import { Link } from "react-router-dom";
import defaultAvatar from "../../../public/default images/avatar.png";
import { formatDistance } from "date-fns";

const Comment = ({ comment }) => {
    const { comment: commentText, image, commentedBy, commentedAt } = comment;
    const { firstname, lastname, username, profilePicture } = commentedBy;

    const commentedTime = formatDistance(new Date(commentedAt), new Date(), { addSuffix: true });

    return (
        <div className="flex items-start gap-x-2 mb-3">
            {/* ---- Profile Picture ---- */}
            <Link to={`/profile/${username}`} className="shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                        src={profilePicture || defaultAvatar}
                        alt={`${firstname} ${lastname}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

            {/* ---- Comment Content ---- */}
            <div className="w-full">
                {/* ---- Comment Bubble ---- */}
                <div className="bg-[var(--color-bg)] rounded-2xl px-4 py-2 inline-block max-w-[93%]">
                    {/* ---- Name ---- */}
                    <Link
                        to={`/profile/${username}`}
                        className="font-semibold text-sm hover:underline block mb-0.5"
                    >
                        {firstname} {lastname}
                    </Link>

                    {/* Comment Text */}
                    <p className="text-[15px] leading-snug break-words">{commentText}</p>
                </div>

                {/* Comment Image (if exists) */}
                {image && (
                    <div className="mt-2 rounded-xl overflow-hidden max-w-[160px]">
                        <img
                            src={image}
                            alt="Comment attachment"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* ---- Comment Time ---- */}
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {commentedTime}
                </p>
            </div>
        </div>
    );
};

export default Comment;
