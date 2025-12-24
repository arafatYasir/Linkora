import { FaUserFriends, FaBookmark } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { Link } from "react-router-dom";
import defaultAvatar from "../../../public/default images/avatar.png";

const HomePageSidebar = ({ user }) => {
    return (
        <div className="col-span-3 hidden xl:block pl-2 sticky top-[76px] overflow-y-auto custom-scrollbar">
            <div>
                <ul className="space-y-1 mb-2">
                    {/* ---- Profile ---- */}
                    <li>
                        <Link to={`/profile/${user?.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition cursor-pointer">
                            <img
                                src={user?.profilePicture || defaultAvatar}
                                alt="Profile"
                                className="w-[36px] h-[36px] rounded-full object-cover select-none"
                            />
                            <span className="font-medium text-text-primary text-[15px]">
                                {user?.firstname} {user?.lastname}
                            </span>
                        </Link>
                    </li>

                    {/* ---- Friends ---- */}
                    <li>
                        <Link to="/friends" className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition cursor-pointer">
                            <div className="w-[36px] h-[36px] rounded-full bg-transparent flex items-center justify-center text-primary-hover">
                                <FaUserFriends size={28} />
                            </div>
                            <span className="font-medium text-text-primary text-[15px]">
                                Friends
                            </span>
                        </Link>
                    </li>

                    {/* ---- Saved Posts ---- */}
                    <li>
                        <Link to="/saved-posts" className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition cursor-pointer">
                            <div className="w-[36px] h-[36px] rounded-full bg-transparent flex items-center justify-center text-purple-500">
                                <FaBookmark size={24} />
                            </div>
                            <span className="font-medium text-text-primary text-[15px]">
                                Saved Posts
                            </span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/shared-posts" className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition cursor-pointer">
                            <div className="w-[36px] h-[36px] rounded-full bg-transparent flex items-center justify-center text-error">
                                <IoIosShareAlt size={28} />
                            </div>
                            <span className="font-medium text-text-primary text-[15px]">
                                Shared Posts
                            </span>
                        </Link>
                    </li>
                </ul>

                {/* ---- Copyright ---- */}
                <div className="mt-auto border-t border-border my-4 pt-4 text-xs text-text-secondary px-2">
                    <p>Linkora © 2025</p>
                </div>
            </div>
        </div>
    );
};

export default HomePageSidebar;
