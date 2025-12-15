import { Link } from "react-router-dom";

const CreatePost = ({ onOpenModal, user, }) => {
    return (
        <div className="w-full bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] cursor-pointer">

            {/* Input area */}
            <div className="flex items-center gap-3">
                <Link to={`/profile/${user.username}`} className="block w-10 h-10 overflow-hidden rounded-full">
                    <img
                        src={user?.profilePicture || "/default images/avatar.png"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </Link>

                <div onClick={onOpenModal} className="flex-1 flex items-center bg-[var(--color-bg)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] rounded-full px-4 h-10">
                    What's on your mind, {user?.firstname}?
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
