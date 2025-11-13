import { IoIosCamera } from "react-icons/io"
import { editOptions } from "../../constants/coverPhoto"
import { useDispatch, useSelector } from "react-redux"
import CoverOption from "./CoverOption"
import { useCallback, useEffect, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import { FaGlobe } from "react-icons/fa"
import { useCreatePostMutation, useUpdateCoverPhotoMutation, useUploadImageMutation } from "../../../api/authApi"
import { getCroppedImage } from "../../helpers/cropImage"
import { addPost, setCoverPhoto } from "../../slices/authSlice"

const CoverPhoto = ({ user, defaultCover }) => {
    // States
    const [showCoverOptions, setShowCoverOptions] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [uploadingState, setUploadingState] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [pixelCrop, setPixelCrop] = useState(null);
    const [width, setWidth] = useState(null);
    const [loading, setLoading] = useState(false);

    // RTK api functions
    const [uploadImage] = useUploadImageMutation();
    const [updateCoverPhoto] = useUpdateCoverPhotoMutation();
    const [createPost] = useCreatePostMutation();

    // Redux States
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const coverOptionsRef = useRef(null);
    const inputFileRef = useRef(null);
    const coverRef = useRef(null);
    const dispatch = useDispatch();

    // useEffect to close dropdowns
    useEffect(() => {
        const handleCloseDropdowns = (e) => {
            // cover options dropdown
            if (coverOptionsRef.current && !coverOptionsRef.current.contains(e.target)) {
                setShowCoverOptions(false);
            }
        }

        document.addEventListener("mousedown", handleCloseDropdowns);

        return () => document.removeEventListener("mousedown", handleCloseDropdowns);
    }, []);

    // useEffect to create image url
    useEffect(() => {
        if (image) {
            const url = URL.createObjectURL(image);

            setImageUrl(url);

            if (!uploadingState) setUploadingState("editing");

            return () => URL.revokeObjectURL(image);
        }
        else {
            setImageUrl(null);
        }
    }, [image]);

    useEffect(() => {
        setWidth(coverRef.current.clientWidth);
    }, [window.innerWidth]);

    // Functions
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setPixelCrop(croppedAreaPixels);
    }, []);

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setImage(imageFile);
    }

    const handleCancel = () => {
        setImage(null);
        setUploadingState(null);
    }

    const handleSave = async () => {
        try {
            const croppedCover = await getCroppedImage(imageUrl, pixelCrop);

            setImage(croppedCover);
            setCrop({ x: 0, y: 0 });
            setUploadingState("saved");
        } catch (e) {
            console.log("Error cropping image: ", e)
        }
    }

    const saveCoverPhotoInLocal = (url) => {
        // Set in redux
        dispatch(setCoverPhoto(url));

        // Set in localstorage
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        userData.coverPhoto = url;

        localStorage.setItem("userInfo", JSON.stringify(userData));
    }

    const savePostInLocal = (post) => {
        // Set in redux
        dispatch(addPost(post));

        // Set in localstorage
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        userData.posts = [...userData.posts, post];

        localStorage.setItem("userInfo", JSON.stringify(userData));
    }

    const handleUpload = async () => {
        try {
            setLoading(true);

            const path = `${user.username}/cover_photo`;
            const formData = new FormData();

            formData.append("path", path);
            formData.append("files", image);

            // upload cover photo first to cloudinary and get the live url
            const coverPhotoResponse = await uploadImage({
                formData
            }).unwrap();

            // Extracting the url
            const url = coverPhotoResponse.images[0].url;

            // Save the live url to database
            const updateResponse = await updateCoverPhoto({ url }).unwrap();

            // Creating a post for cover photo update
            const postResponse = await createPost({
                type: "cover-photo",
                images: [url],
                text: null,
                background: null,
                user: userInfo._id
            }).unwrap();

            if (postResponse.status === "OK") {
                setImage(null);
                setPixelCrop(null);
                setCrop({ x: 0, y: 0 });
                setUploadingState(null);
            }
            // Saving that profile picture url in local
            const coverPhotoUrl = updateResponse.url;
            saveCoverPhotoInLocal(coverPhotoUrl);

            // Saving that profile picture changing post in local
            const post = { ...postResponse.post };
            post.user = userInfo;

            savePostInLocal(post);
        } catch (e) {
            console.log("Error while uploading cover photo: ", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* ---- Cancel & Save Photo ---- */}
            {
                image && (
                    <div className="absolute z-20 top-0 left-0 w-full flex items-center justify-between bg-black/10 px-4 py-3 backdrop-blur-[3px]">
                        <p className="flex items-center gap-x-3">
                            <FaGlobe size={19} />
                            <span>Your cover photo is public.</span>
                        </p>

                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                className="py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-text-primary/20 hover:bg-text-primary/40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={uploadingState === "editing" ? handleSave : handleUpload}
                                className="px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary hover:bg-primary-hover"
                            >
                                {
                                    uploadingState === "editing" ? "Save Changes" : loading ? "Uploading..." : "Upload Photo"
                                }
                            </button>
                        </div>
                    </div>
                )
            }

            <div ref={coverRef} className="relative w-full h-[400px] mx-auto bg-border rounded-lg overflow-hidden">
                {/* ---- Cover Photo ---- */}
                <div className="w-full h-full cover-photo">
                    {
                        (image && uploadingState === "editing") ? (
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={1}
                                zoomWithScroll={false}
                                aspect={width / 400}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                objectFit="horizontal-cover"
                            />
                        ) : (image && uploadingState === "saved") ? (
                            <img src={imageUrl} alt="Cover Photo" className="w-full h-full object-cover" />
                        ) : (!image && !uploadingState) ? (
                            <img src={user.coverPhoto || defaultCover} alt="Cover Photo" className="w-full h-full object-cover" />
                        ) : <></>
                    }
                </div>

                {/* ---- File Input ---- */}
                <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg, image/png, image/svg, image/webp, image/gif"
                    onChange={handleImageChange}
                />

                {/* ---- If it is the same user then let him edit ---- */}
                {
                    (userInfo._id === user._id && !image) && (
                        <div ref={coverOptionsRef}>
                            {/* ---- Edit Cover ---- */}
                            <button
                                className="flex items-center gap-x-2 absolute bottom-10 right-10 z-10 bg-border px-3 py-1.5 rounded-lg cursor-pointer active:scale-98"
                                onClick={() => setShowCoverOptions(prev => !prev)}
                            >
                                <IoIosCamera size={24} />
                                <span className="font-semibold text-[17px]">Edit cover photo</span>
                            </button>

                            {/* ---- Edit Cover Options ---- */}
                            {showCoverOptions && (
                                <ul className="flex flex-col absolute bottom-20 right-10 bg-border px-3 py-2 rounded-lg transition-all">
                                    {editOptions.map(option => (
                                        <CoverOption key={option.id} option={option} inputFileRef={inputFileRef} setShowCoverOptions={setShowCoverOptions} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default CoverPhoto