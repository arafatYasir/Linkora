import { Link } from "react-router-dom";
import { useListImagesQuery } from "../../../api/authApi";
import ProfilePhotosFallbackUI from "./ProfilePhotosFallbackUI";

const ProfilePhotos = ({ user }) => {
    const path = user.username;
    const sorting = "desc";
    const maxLimit = 30;

    // Calling api to get all the photos
    const { data, isLoading } = useListImagesQuery({ path, sorting, maxLimit });

    console.log(data);

    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6">Photos</h3>
                <Link to="/photos" className="text-primary p-2 rounded-lg hover:text-text-primary hover:bg-primary/50 transition-all duration-250">See all photos</Link>
            </div>

            {/* ---- Images ---- */}
            {
                isLoading ? <ProfilePhotosFallbackUI /> : (
                    <div className="flex flex-wrap justify-between gap-y-2.5 mt-2">
                        {
                            data.resources.map(item => (
                                <div
                                    key={item.asset_id}
                                    className="w-[120px] h-[120px] overflow-hidden cursor-pointer hover:opacity-70 transition-all duration-250"
                                >
                                    <img
                                        src={item.secure_url}
                                        alt="Yasir Arafat Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ProfilePhotos