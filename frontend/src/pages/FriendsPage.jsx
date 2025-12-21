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
                            className="w-full border border-border rounded-lg"
                        >
                            <Link className="block" to={`/profile/${user.username}`}>
                                <div className="relative">
                                    {/* ---- Cover Photo ---- */}
                                    <div className="w-full h-[140px] overflow-hidden rounded-t-lg">
                                        <img className="w-full h-full object-cover" src={user.coverPhoto || defaultCoverPhoto} alt="" />
                                    </div>

                                    {/* ---- Profile Picture ---- */}
                                    <div className="w-24 h-24 overflow-hidden rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-bg">
                                        <img className="w-full h-full object-cover" src={user.profilePicture || defaultAvatar} alt="" />
                                    </div>
                                </div>

                                {/* ---- User Info ---- */}
                                <div className="p-3 mt-10">
                                    <p className="font-bold text-center">{user.firstname + " " + user.lastname.slice(0, 20)}{user.firstname + " " + user.lastname.length > 20 ? "..." : ""}</p>

                                    {/* ---- Profile Status ---- */}
                                    <div className="flex gap-x-8 justify-center mt-3">
                                        <p className="flex flex-col gap-y-1 items-center relative after:absolute after:content-[''] after:w-[2px] after:h-10 after:bg-border after:-right-[16px] after:top-1/2 after:-translate-y-1/2 after:z-10">
                                            <span className="font-bold">
                                                {user.friends.length}
                                            </span>
                                            <span> Friend{user.friends.length > 1 ? "s" : ""}</span>
                                        </p>

                                        <p className="flex flex-col gap-y-1 items-center relative after:absolute after:content-[''] after:w-[2px] after:h-10 after:bg-border after:-right-[16px] after:top-1/2 after:-translate-y-1/2 after:z-10">
                                            <span className="font-bold">
                                                {user.followers.length}
                                            </span>
                                            <span> Follower{user.followers.length > 1 ? "s" : ""}</span>
                                        </p>

                                        <p className="flex flex-col gap-y-1 items-center">
                                            <span className="font-bold">
                                                {user.following.length}
                                            </span>
                                            <span> Following</span>
                                        </p>
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