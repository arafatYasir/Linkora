import { useCallback, useRef, useState } from 'react';
import { IoMdClose, IoMdAdd } from 'react-icons/io';
import Cropper from 'react-easy-crop'

const ChangeProfilePicture = ({ images = [], setShowUploadModal }) => {
    // States
    const [picture, setPicture] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    // Extra hooks
    const fileInputRef = useRef(null);

    // Functions
    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    }
    
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, []);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl shadow-lg overflow-hidden bg-surface border border-border">
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

                {/* ---- Image Preview ---- */}
                {
                    picture && (
                        <div className="w-full h-[400px] relative overflow-hidden">
                            <Cropper
                                image={URL.createObjectURL(picture)}
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

                {/* ---- Upload Button ---- */}
                <div className="px-6 py-4">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary text-white hover:bg-primary-hover"
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

                    {/* Images Grid */}
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
        </div>
    );
};

export default ChangeProfilePicture;