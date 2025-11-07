const CreatePost = ({ onOpenModal, user, }) => {
    return (
        <div className="w-full bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] cursor-pointer hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">

            {/* Input area */}
            <div onClick={onOpenModal} className="flex items-center gap-3">
                <img
                    src={user.profilePicture || "/default images/avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-[var(--radius-avatar)] object-cover border border-[var(--color-border)]"
                />
                <div className="flex-1 bg-[var(--color-bg)] text-[var(--color-text-secondary)] rounded-full px-4 py-2 hover:bg-[var(--dark-color-bg)] transition-[var(--transition-default)]">
                    What's on your mind, {user.firstname}?
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
