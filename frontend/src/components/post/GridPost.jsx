import { formatDistance } from "date-fns";
import defaultAvatar from "/default images/avatar.png"

const GridPost = ({ post }) => {
    // Extracting data from post
    const { text, type, user, background, comments, images } = post;

    // Calculating posted date
    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        <li className="w-full h-[240px] rounded-[var(--radius-card)] overflow-hidden">
            {/* ---- Post Images ---- */}
            {
                (images && images.length > 0) ? (
                    <div className="w-full h-[180px] overflow-hidden cursor-pointer">
                        <img src={post.images[0]} alt="Post Image" className="w-full h-full object-cover" />
                    </div>
                ) : (background) ? (
                    <div
                        style={{
                            background: `url("${background}")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        className="w-full h-[180px] cursor-pointer flex items-center justify-center font-semibold text-center"
                    >
                        {text}
                    </div>
                ) : (
                    <div className="w-full h-[180px] bg-border hover:bg-border/60 transition-all duration-250 cursor-pointer"></div>
                )
            }

            {/* ---- Post Info ---- */}
            <div className="bg-surface w-full h-[60px] px-3 flex items-center gap-x-2">
                {/* ---- Avatar ---- */}
                <div className="w-12 h-12 overflow-hidden rounded-full">
                    <img src={user.profilePicture || defaultAvatar} alt="Profile Picture" className="w-full h-full object-cover" />
                </div>

                {/* ---- Text ---- */}
                <div>
                    <p className="text-xs font-semibold">{text}</p>
                    <span className="text-[11px] font-semibold text-primary">{postedTime}</span>
                </div>
            </div>
        </li>
    )
}

export default GridPost