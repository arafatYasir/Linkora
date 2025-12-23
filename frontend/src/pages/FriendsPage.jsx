import { Link, useLocation } from "react-router-dom";
import { useGetFriendsQuery } from "../../api/authApi"
import defaultAvatar from "/default images/avatar.png"
import defaultCoverPhoto from "/default images/defaultcover.jpg"

const FriendsPage = () => {
    // Friends data fetching api
    const { data, isLoading, isError } = useGetFriendsQuery();

    // Extra hooks
    const { pathname } = useLocation();
    let type = pathname.split("/friends/")[1];

    if (!type) {
        type = "friends";
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error</div>
    }

    return (
        <div className="flex-1 pr-4 mt-4">
            {/* ---- Total Count ---- */}
            <h4 className="font-bold text-xl">Total Results: {data?.data[type]?.length}</h4>

            {/* ---- Search ---- */}
            <div className="mt-5">
                <input className="block border border-text-secondary rounded py-2 px-3 w-1/3" type="text" name="search" id="search" placeholder="Search" />
            </div>

            {/* ---- List according to the type ---- */}
            <ul className="grid grid-cols-3 gap-3 mt-10">
                {
                    data?.data[type]?.map(user => (
                        <li
                            key={user._id}
                            className="w-full h-[220px] border border-border rounded-lg relative"
                        >
                            <Link className="block" to={`/profile/${user.username}`}>
                                <div className="relative">
                                    {/* ---- Cover Photo ---- */}
                                    <div className="w-full h-[140px] overflow-hidden rounded-t-lg">
                                        <img className="w-full h-full object-cover" src={user.coverPhoto || defaultCoverPhoto} alt="" />
                                    </div>

                                    <div className="absolute left-2 -bottom-4 translate-y-1/2 flex items-center">
                                        {/* ---- Profile Picture ---- */}
                                        <div className="w-20 h-20 overflow-hidden rounded-full border-4 border-bg shrink-0">
                                            <img className="w-full h-full object-cover" src={user.profilePicture || defaultAvatar} alt="" />
                                        </div>

                                        {/* ---- User Info ---- */}
                                        <div className="p-2 mt-5">
                                            <p className="font-bold">{user.firstname + " " + user.lastname.slice(0, 20)}{user.firstname + " " + user.lastname.length > 20 ? "..." : ""}</p>

                                            {/* ---- Profile Status ---- */}
                                            <div className="mt-1">
                                                <p className="space-x-1">
                                                    <span className="text-xs">{user?.friends?.length} Friend{user?.friends?.length === 1 ? "" : "s"}</span>
                                                    <span>•</span>
                                                    <span className="text-xs">{user?.followers?.length} Follower{user?.followers?.length === 1 ? "" : "s"}</span>
                                                    <span>•</span>
                                                    <span className="text-xs">{user?.following?.length} Following</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default FriendsPage