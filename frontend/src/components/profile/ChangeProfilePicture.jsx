import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose, IoMdAdd, IoMdRemove } from 'react-icons/io';
import Cropper from 'react-easy-crop'
import { MdEdit } from "react-icons/md";
import { PiFrameCorners } from "react-icons/pi";
import { getCroppedImage } from '../../helpers/cropImage';
import { FaUpload } from "react-icons/fa6";
import { useCreatePostMutation, useUpdateProfilePictureMutation, useUploadImageMutation } from '../../../api/authApi';
import { addPost, setProfilePicture } from '../../slices/authSlice';
import PhotosGroup from './PhotosGroup';

const ChangeProfilePicture = ({ setShowUploadModal, refetchPosts, images = [] }) => {
    // States
    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);
    const [isPreviousImage, setIsPreviousImage] = useState(false);
    const [caption, setCaption] = useState("");
    const [pixelCrop, setPixelCrop] = useState(null);
    const [imageSaved, setImageSaved] = useState(false);
    const [editingMode, setEditingMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [profilePictures, setProfilePictures] = useState([]);
    const [coverPhotos, setCoverPhotos] = useState([]);
    const [uploads, setUploads] = useState([]);

    // Redux state
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const fileInputRef = useRef(null);
    const uploadModalRef = useRef(null);
    const rangeInputRef = useRef(null);
    const dispatch = useDispatch();

    // API calling
    const [uploadImage] = useUploadImageMutation();
    const [updateProfilePicture] = useUpdateProfilePictureMutation();
    const [createPost] = useCreatePostMutation();

    // Constants
    const MIN = 1;
    const MAX = 2;
    const STEPS = 0.01;

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

    useEffect(() => {
        if (picture) {
            if (typeof picture === "string") {
                setPictureUrl(picture);
                setIsPreviousImage(true);
            }
            else {
                const url = URL.createObjectURL(picture);
                setPictureUrl(url);
                setIsPreviousImage(false);

                return () => URL.revokeObjectURL(url);
            }
        }
        else {
            if (pictureUrl && !isPreviousImage) {
                URL.revokeObjectURL(pictureUrl);
            }
            setPictureUrl(null);
            setIsPreviousImage(false);
        }
    }, [picture, pictureUrl, isPreviousImage]);

    useEffect(() => {
        const handleCloseUploadModal = (e) => {
            if (uploadModalRef.current && !uploadModalRef.current.contains(e.target)) {
                setShowUploadModal(false);
            }
        }

        document.addEventListener("mousedown", handleCloseUploadModal);

        return () => document.removeEventListener("mousedown", handleCloseUploadModal);
    }, []);

    // Functions
    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    }

    const saveProfilePictureInLocal = (url) => {
        // Set in redux
        dispatch(setProfilePicture(url));

        // Set in localstorage
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        userData.profilePicture = url;

        localStorage.setItem("userInfo", JSON.stringify(userData));

        // Re-fetch posts to remove old profile picture url from posts
        refetchPosts();
    }

    const savePostInLocal = (post) => {
        // Set in redux
        dispatch(addPost(post));

        // Set in localstorage
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        userData.posts = [...userData.posts, post];

        localStorage.setItem("userInfo", JSON.stringify(userData));
    }

    const handleAddOrUpload = async () => {
        if (!picture && !imageSaved) {
            fileInputRef.current.click();
        }
        else if (picture && imageSaved) {
            try {
                setLoading(true);
                let blob;

                if (isPreviousImage) {
                    const res = await fetch(picture);
                    blob = await res.blob();
                }
                else {
                    blob = picture;
                }

                const path = `${userInfo.username}/profile_pictures`;
                const formData = new FormData();

                formData.append("path", path);
                formData.append("files", blob);

                // upload profile picture first to cloudinary and get the live url
                const profilePictureResponse = await uploadImage({
                    formData,
                }).unwrap();

                // Extracting the url
                const url = profilePictureResponse.images[0].url;

                // Save the live url to database
                const updateResponse = await updateProfilePicture({ url }).unwrap();

                // Creating a post for profile picture update
                const postResponse = await createPost({
                    type: "profile-picture",
                    images: [url],
                    text: caption,
                    background: null,
                    user: userInfo._id
                }).unwrap();

                if (postResponse.status === "OK") {
                    setShowUploadModal(false);
                    setPicture(null);
                    setCaption("");
                    setPixelCrop(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                }

                // Saving that profile picture url in local
                const profilePictureUrl = updateResponse.url;
                saveProfilePictureInLocal(profilePictureUrl);

                // Saving that profile picture changing post in local
                const post = { ...postResponse.post };
                post.user = userInfo;

                savePostInLocal(post);

                // Reset input file value
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } catch (e) {
                console.log("Error while uploading the profile picture: ", e);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleCancel = () => {
        if (editingMode) {
            setImageSaved(true);
        }
        else {
            setPicture(null);
        }
        setCrop({ x: 0, y: 0 });
        setZoom(1);

        // Reset input file value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setPixelCrop(croppedAreaPixels);
    }, []);

    const zoomOut = () => {
        rangeInputRef.current.stepDown();
        setZoom(rangeInputRef.current.value);
    }

    const zoomIn = () => {
        rangeInputRef.current.stepUp();
        setZoom(rangeInputRef.current.value);
    }

    const saveImage = async () => {
        try {
            const croppedImageBlob = await getCroppedImage(pictureUrl, pixelCrop);
            const croppedImageBlobPreview = URL.createObjectURL(croppedImageBlob);

            setPicture(croppedImageBlob);
            setPictureUrl(croppedImageBlobPreview);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setImageSaved(true);
            setEditingMode(false);
        } catch (e) {
            console.log("Error cropping image: ", e);
        }
    }

    const handleSwitchEditMode = () => {
        setEditingMode(true);
        setImageSaved(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-scroll">
            <div ref={uploadModalRef} className={`w-full max-w-2xl rounded-xl shadow-lg overflow-hidden bg-surface border border-border ${picture ? "mt-26" : "mt-0"} py-4`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Choose Profile Picture
                    </h2>
                    <button
                        onClick={() => {
                            setPicture(null);
                            setShowUploadModal(false);
                        }}
                        className="p-2 rounded-full transition-all duration-250 cursor-pointer text-[var(--color-text-secondary)] bg-border hover:bg-primary/50"
                        aria-label="Close"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>

                {/* ---- Conditional Description Input ---- */}
                {
                    picture && (
                        <div className="px-6 mt-4">
                            <label htmlFor="caption">Caption (optional)</label>
                            <textarea
                                placeholder="Description"
                                className="border resize-none w-full rounded-lg px-4 py-3 mt-2"
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>
                    )
                }

                {/* ---- Image Preview (on editing mode) ---- */}
                {
                    (picture && !imageSaved) && (
                        <div className="w-full h-[400px] relative overflow-hidden mt-8">
                            <Cropper
                                image={pictureUrl}
                                crop={crop}
                                zoom={zoom}
                                zoomWithScroll={false}
                                cropShape="round"
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                    )
                }

                {/* ---- Image Preview (after saving the image) ---- */}
                {
                    (picture && imageSaved) && (
                        <div className="w-[400px] h-[400px] mx-auto relative overflow-hidden rounded-full my-8">
                            <img src={pictureUrl} alt="Profile Picture" className="w-full h-full object-cover" />
                        </div>
                    )
                }

                {/* ---- Image zoom in and zoom out slider ---- */}
                {
                    (picture && !imageSaved) && (
                        <div className="flex items-center justify-center my-8 gap-x-1">
                            <button
                                onClick={zoomOut}
                                className="p-2 hover:bg-border transition-all duration-250 rounded-full cursor-pointer"
                            >
                                <IoMdRemove size={25} />
                            </button>
                            <input
                                ref={rangeInputRef}
                                type="range"
                                className="cursor-pointer zoom-range"
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                                min={MIN}
                                max={MAX}
                                step={STEPS}
                                style={{
                                    width: "400px",
                                    background: `linear-gradient(to right, var(--color-primary) ${((zoom - MIN) / (MAX - MIN)) * 100}%, var(--color-border) ${((zoom - MIN) / (MAX - MIN)) * 100}%)`
                                }}
                            />
                            <button
                                onClick={zoomIn}
                                className="p-2 hover:bg-border transition-all duration-250 rounded-full cursor-pointer"
                            >
                                <IoMdAdd size={25} />
                            </button>
                        </div>
                    )
                }

                {/* ---- All Initial Buttons (Upload, Frame, Edit) - Conditionally Rendering (Cancel, Save) ---- */}
                {
                    (picture && !imageSaved) ? (
                        <div className="px-6 flex items-center justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                className="w-[15%] py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer  hover:bg-border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveImage}
                                className="w-[20%] py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary hover:bg-primary-hover"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 pt-4 flex items-center justify-between">
                            {/* ---- Upload Btn ---- */}
                            <div className="w-[44%]">
                                <button
                                    onClick={handleAddOrUpload}
                                    className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary/50 hover:bg-primary-hover"
                                >
                                    {(!picture && !imageSaved) ? <IoMdAdd size={20} /> : <FaUpload />}
                                    <span>
                                        {
                                            !loading ? (
                                                (!picture && !imageSaved) ? "Add Image" : "Upload"
                                            ) : (
                                                "Uploading..."
                                            )
                                        }
                                    </span>
                                </button>

                                {/* ---- File Input ---- */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            {/* ---- Add Frame Btn ---- */}
                            <div className="w-[44%]">
                                <button
                                    className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-border hover:bg-primary/50 "
                                >
                                    <PiFrameCorners size={20} />
                                    <span>Add Frame</span>
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={handleSwitchEditMode}
                                    className="py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-border hover:bg-primary/50 "
                                >
                                    <MdEdit size={20} />
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* ---- Other Images ---- */}
                {
                    !picture && (
                        <div className="px-6 mt-4 flex flex-col gap-y-2 font-[Inter]">
                            {/* ---- Profile Pictures ---- */}
                            {
                                (profilePictures.length > 0) && <PhotosGroup groupName="Profile Pictures" images={profilePictures} select={true} setImage={setPicture} cols={5} />
                            }

                            {/* ---- Cover Photos ---- */}
                            {
                                (coverPhotos.length > 0) && <PhotosGroup groupName="Cover Photos" images={coverPhotos} select={true} setImage={setPicture} cols={5} />
                            }

                            {/* ---- Uploads ---- */}
                            {
                                (uploads.length > 0) && <PhotosGroup groupName="Uploads" images={uploads} select={true} setImage={setPicture} cols={5} />
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ChangeProfilePicture;