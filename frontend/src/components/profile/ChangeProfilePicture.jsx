import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdClose, IoMdAdd, IoMdRemove } from 'react-icons/io';
import Cropper from 'react-easy-crop'
import { MdEdit } from "react-icons/md";
import { PiFrameCorners } from "react-icons/pi";
import { getCroppedImage } from '../../helpers/cropImage';
import { FaUpload } from "react-icons/fa6";

const ChangeProfilePicture = ({ images = [], setShowUploadModal }) => {
    // States
    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [pixelCrop, setPixelCrop] = useState(null);
    const [imageSaved, setImageSaved] = useState(false);
    const [editingMode, setEditingMode] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // Extra hooks
    const fileInputRef = useRef(null);
    const uploadModalRef = useRef(null);
    const rangeInputRef = useRef(null);

    // Constants
    const MIN = 1;
    const MAX = 2;
    const STEPS = 0.01;

    // Functions
    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    }

    const handleAddOrUpload = () => {
        if(!picture && !imageSaved) {
            fileInputRef.current.click();
        }
        else if(picture && imageSaved) {
            console.log("Uploading the file!!!");
        }
    }

    const handleCancel = () => {
        if(editingMode) {
            setImageSaved(true);
        }
        else {
            setPicture(null);
        }


        setCrop({x: 0, y: 0});
        setZoom(1);
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels);
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
        const image = await getCroppedImage(pictureUrl, pixelCrop);
        setPicture(image);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setImageSaved(true);
        setEditingMode(false);
    }

    const handleSwitchEditMode = () => {
        setEditingMode(true);
        setImageSaved(false);
    }

    useEffect(() => {
        if (picture) {
            const url = URL.createObjectURL(picture);
            setPictureUrl(url);

            return () => URL.revokeObjectURL(url);
        }
        else {
            setPictureUrl(null);
        }
    }, [picture]);

    useEffect(() => {
        const handleCloseUploadModal = (e) => {
            if (uploadModalRef.current && !uploadModalRef.current.contains(e.target)) {
                setShowUploadModal(false)
            }
        }

        document.addEventListener("mousedown", handleCloseUploadModal);

        return () => document.removeEventListener("mousedown", handleCloseUploadModal);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-scroll">
            <div ref={uploadModalRef} className={`w-full max-w-2xl rounded-xl shadow-lg overflow-hidden bg-surface border border-border ${picture ? "mt-26" : "mt-0"} py-4`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Choose Profile Picture
                    </h2>
                    <button
                        onClick={() => {
                            setPicture(null);
                            setShowUploadModal(false);
                        }}
                        className="p-2 rounded-lg transition-all duration-250 cursor-pointer text-text-secondary bg-transparent hover:bg-border"
                    >
                        <IoMdClose size={24} />
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
                            // showGrid={false}
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
                                        {(!picture && !imageSaved) ? "Add Image" : "Upload"}
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
                {images && images.length > 0 && (
                    <div className="flex flex-wrap justify-between gap-y-2.5 mt-4">
                        {images.map((item) => (
                            <div
                                key={item.asset_id}
                                className="w-[120px] h-[120px] overflow-hidden cursor-pointer rounded-lg transition-all duration-250 border border-border hover:opacity-50"
                            >
                                <img
                                    src={item.secure_url}
                                    alt="Profile Picture Option"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangeProfilePicture;