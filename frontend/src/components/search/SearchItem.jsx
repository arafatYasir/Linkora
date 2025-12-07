import { IoMdClose } from "react-icons/io"
import { Link } from "react-router-dom"

const SearchItem = ({ user, add, remove, type }) => {
    return (
        <div className="relative">
            <Link
                to={`/profile/${user.username}`}
                onClick={() => add(user._id)}
                className="flex items-center gap-3 p-2 hover:bg-surface rounded-lg cursor-pointer transition"
            >
                <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    <img
                        src={user.profilePicture}
                        alt={`${user.firstname} ${user.lastname}'s Profile Picture`}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <p className="font-medium">{user.firstname} {user.lastname}</p>
                </div>
            </Link>

            <div className="absolute top-1/2 right-1 -translate-y-1/2">
                {
                    type === "result" ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <button className="p-1.5 hover:bg-border rounded-full cursor-pointer" onClick={remove}>
                            <IoMdClose />
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default SearchItem