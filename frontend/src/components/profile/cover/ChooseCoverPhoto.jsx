import { IoMdClose } from "react-icons/io";
import ChoosePhotosSkeleton from "../ChoosePhotosSkeleton";
import { useEffect, useState } from "react";
import PhotosGroup from "../PhotosGroup";

const ChooseCoverPhoto = ({ setImage, setShowChooseModal, chooseModalRef, isImagesLoading, images }) => {
    const [profilePictures, setProfilePictures] = useState([]);
    const [coverPhotos, setCoverPhotos] = useState([]);
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        const profiles = [], covers = [], otherUploads = [];

        images.resources.map(image => {
            if (image.asset_folder.includes("profile_pictures")) {
                profiles.push(image.secure_url);
            }
            else if (image.asset_folder.includes("cover_photo")) {
                covers.push(image.secure_url);
            }
            else {
                otherUploads.push(image.secure_url);
            }
        });

        if (profiles.length > 0) {
            setProfilePictures(profiles);
        }
        if (covers.length > 0) {
            setCoverPhotos(covers);
        }
        if (otherUploads.length > 0) {
            setUploads(otherUploads);
        }
    }, [images]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div ref={chooseModalRef} className={`w-full max-w-xl rounded-xl shadow-lg overflow-hidden bg-surface border border-border py-4`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Choose Profile Picture
                    </h2>
                    <button
                        onClick={() => {
                            setShowChooseModal(false);
                        }}
                        className="p-2 rounded-full transition-all duration-250 cursor-pointer text-text-secondary bg-border hover:bg-primary/50"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 mt-4 flex flex-col gap-y-2">
                    {
                        isImagesLoading ? <ChoosePhotosSkeleton /> : (
                            <>
                                {/* ---- Profile Pictures ---- */}
                                {
                                    (profilePictures.length > 0) && <PhotosGroup groupName="Profile Pictures" images={profilePictures} select={true} setImage={setImage} closeModal={true} setCloseModal={setShowChooseModal} />
                                }

                                {/* ---- Cover Photos ---- */}
                                {
                                    (coverPhotos.length > 0) && <PhotosGroup groupName="Cover Photos" images={coverPhotos} select={true} setImage={setImage} closeModal={true} setCloseModal={setShowChooseModal} />
                                }

                                {/* ---- Uploads ---- */}
                                {
                                    (uploads.length > 0) && <PhotosGroup groupName="Uploads" images={uploads} select={true} setImage={setImage} closeModal={true} setCloseModal={setShowChooseModal} />
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ChooseCoverPhoto