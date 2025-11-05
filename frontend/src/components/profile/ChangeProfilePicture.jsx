import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdClose, IoMdAdd } from 'react-icons/io';
import Cropper from 'react-easy-crop'
import { MdEdit } from "react-icons/md";
import { PiFrameCorners } from "react-icons/pi";

const ChangeProfilePicture = ({ images = [], setShowUploadModal }) => {
    // States
    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    // Extra hooks
    const fileInputRef = useRef(null);
    const uploadModalRef = useRef(null);

    // Functions
    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, []);

    useEffect(() => {
        if(picture) {
            const url = URL.createObjectURL(picture);
            setPictureUrl(url);

            return () => URL.revokeObjectURL(url);
        }
        else {
            setPictureUrl(null);
        }
    }, [picture]);

    useEffect(() => {
        const  handleCloseUploadModal = (e) => {
            if(uploadModalRef.current && !uploadModalRef.current.contains(e.target)) {
                setShowUploadModal(false)
            }
        }

        document.addEventListener("mousedown", handleCloseUploadModal);

        return () => document.removeEventListener("mousedown", handleCloseUploadModal);
    }, [])


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div ref={uploadModalRef} className="w-full max-w-2xl rounded-xl shadow-lg overflow-hidden bg-surface border border-border">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
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

                {/* ---- Image Preview ---- */}
                {
                    picture && (
                        <div className="w-full h-[400px] relative overflow-hidden mt-4 border-b">
                            <Cropper
                                image={pictureUrl}
                                crop={crop}
                                zoom={zoom}
                                cropShape="round"
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                    )
                }

                {/* ---- All Initial Buttons (Upload, Frame, Edit) - Conditionally Rendering (Cancel, Save) ---- */}
                {
                    picture ? (
                        <div className="px-6 py-4 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setPicture(null)}
                                className="w-[15%] py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer text-white hover:bg-border"
                            >
                                Cancel
                            </button>
                            <button
                                className="w-[20%] py-2 px-5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary text-white hover:bg-primary-hover"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 py-4 flex items-center justify-between">
                            {/* ---- Upload Btn ---- */}
                            <div className="w-[44%]">
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary/50 text-white hover:bg-primary-hover"
                                >
                                    <IoMdAdd size={20} />
                                    <span>Upload</span>
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
                                    className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-border hover:bg-primary/50 text-white"
                                >
                                    <PiFrameCorners size={20} />
                                    <span>Add Frame</span>
                                </button>
                            </div>

                            <div>
                                <button
                                    className="py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-border hover:bg-primary/50 text-white"
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