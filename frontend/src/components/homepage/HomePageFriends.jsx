import { FaSearch, FaEllipsisH } from "react-icons/fa";
import defaultAvatar from "../../../public/default images/avatar.png"
import { Link } from "react-router-dom";

const HomePageFriends = ({ friends }) => {
    return (
        <div className="col-span-3 hidden xl:block pr-2 sticky top-[76px] overflow-y-auto custom-scrollbar">
            <div>
                {/* ---- Header ---- */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-text-secondary font-semibold text-[15px]">Contacts</h3>
                    <div className="flex gap-4 text-text-secondary">
                        <FaSearch className="w-4 h-4 cursor-pointer hover:text-text-primary transition" />
                        <FaEllipsisH className="w-4 h-4 cursor-pointer hover:text-text-primary transition" />
                    </div>
                </div>

                {/* ---- Contacts List ---- */}
                <ul className="space-y-1">
                    {friends?.length > 0 ? (
                        friends.map((friend) => (
                            <li key={friend._id} >
                                <Link to={`/profile/${friend.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition cursor-pointer group">
                                    <div className="relative">
                                        <img
                                            src={friend.profilePicture || defaultAvatar}
                                            alt={`${friend.firstname} ${friend.lastname}`}
                                            className="w-[36px] h-[36px] rounded-full object-cover"
                                        />
                                        {/* ---- Online Indicator ---- */}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface"></div>
                                    </div>
                                    <span className="font-medium text-text-primary text-[15px] group-hover:text-text-primary">
                                        {friend.firstname} {friend.lastname}
                                    </span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <div className="px-2 text-sm text-text-secondary">
                            No active contacts
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default HomePageFriends