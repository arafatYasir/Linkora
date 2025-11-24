import { Link } from "react-router-dom";
import defaultPhoto from "../../../public/default images/avatar.png"
import ProfilePhotosSkeleton from "./ProfilePhotosSkeleton";

const FriendsList = ({ friends }) => {
    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6">Friends ({friends?.length || 0})</h3>
                <Link to="friends" className="text-primary p-2 rounded-lg hover:text-text-primary hover:bg-primary/50 transition-all duration-250">See all friends</Link>
            </div>

            {/* ---- Images ---- */}
            {
                (!friends) ? <ProfilePhotosSkeleton /> : (
                    <div className="grid grid-cols-[120px_120px_120px] justify-between gap-y-2.5 mt-4">
                        {
                            friends.map(friend => (
                                <Link 
                                    key={friend._id}
                                    to={`/profile/${friend.username}`}
                                    className="block"
                                >
                                    <div
                                        className="w-[120px] h-[120px] overflow-hidden cursor-pointer hover:opacity-70 transition-all duration-250 rounded-xl"
                                    >
                                        <img
                                            src={friend.profilePicture || defaultPhoto}
                                            alt="Yasir Arafat Image"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <p className="text-sm mt-1">{friend.firstname + " " + friend.lastname}</p>
                                </Link>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default FriendsList