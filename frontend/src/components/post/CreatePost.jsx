const CreatePost = ({ onOpenModal, user, }) => {
    return (
        <div className="w-full bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] cursor-pointer">

            {/* Input area */}
            <div onClick={onOpenModal} className="flex items-center gap-3">
                <img
                    src={user?.profilePicture || "/default images/avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-[var(--radius-avatar)] object-cover border border-[var(--color-border)]"
                />
                <div className="flex-1 flex items-center bg-[var(--color-bg)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] rounded-full px-4 h-10">
                    What's on your mind, {user?.firstname}?
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
