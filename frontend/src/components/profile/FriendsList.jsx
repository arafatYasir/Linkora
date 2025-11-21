import { Link } from "react-router-dom";

const FriendsList = ({friends}) => {
    // console.log(friends);
    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6">Friends ({friends?.length || 0})</h3>
                <Link to="friends" className="text-primary p-2 rounded-lg hover:text-text-primary hover:bg-primary/50 transition-all duration-250">See all friends</Link>
            </div>

            {/* ---- Images ---- */}
            {/* {
                (!images || isImagesLoading) ? <ProfilePhotosSkeleton /> : (
                    <div className="grid grid-cols-[120px_120px_120px] justify-between gap-y-2.5 mt-4">
                        {
                            images.resources.map(image => (
                                <div
                                    key={image.asset_id}
                                    className="w-[120px] h-[120px] overflow-hidden cursor-pointer hover:opacity-70 transition-all duration-250"
                                >
                                    <img
                                        src={image.secure_url}
                                        alt="Yasir Arafat Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        }
                    </div>
                )
            } */}
        </div>
    )
}

export default FriendsList