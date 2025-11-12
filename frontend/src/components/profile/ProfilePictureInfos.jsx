import { useEffect, useState } from "react";
import { IoIosCamera } from "react-icons/io"
import { useSelector } from "react-redux"
import ChangeProfilePicture from "./ChangeProfilePicture";

const ProfilePictureInfos = ({ user, defaultPhoto, refetchPosts, isImagesLoading, images }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const { userInfo } = useSelector(state => state.auth);

    // Locking the scroll when modal is open
    useEffect(() => {
        const body = document.querySelector("body");
        if(showUploadModal) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflowY = "scroll";
        }
    }, [showUploadModal]);

    return (
        <div className="flex items-end gap-x-4 absolute -bottom-28 left-10">
            <div className="relative">
                <div className="w-44 h-44 rounded-full border-4 border-bg overflow-hidden">
                    <img
                        src={user.profilePicture || defaultPhoto}
                        alt={`${user.firstname} ${user.lastname}'s Profile Picture | ${user.username}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* ---- Change Profile Picture ---- */}
                {
                    userInfo._id === user._id && (
                        <button 
                            className="absolute bottom-5 right-2 bg-border p-1 rounded-full hover:bg-primary transition-all duration-250 cursor-pointer"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <IoIosCamera size={24} />
                        </button>
                    )
                }
                {
                    showUploadModal && <ChangeProfilePicture setShowUploadModal={setShowUploadModal} refetchPosts={refetchPosts} isImagesLoading={isImagesLoading} images={images} />
                }
            </div>

            <div className="flex flex-col gap-y-4 mb-5">
                <span className="text-[32px] font-bold leading-[16px]">{user.firstname} {user.lastname}</span>
                <span className="text-[15px] font-semibold leading-[16px]">{user.friends.length} Friends</span>
            </div>
        </div>
    )
}

export default ProfilePictureInfos