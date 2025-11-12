import { IoIosCamera } from "react-icons/io"
import { editOptions } from "../../constants/coverPhoto"
import { useSelector } from "react-redux"
import CoverOption from "./CoverOption"
import { useCallback, useEffect, useRef, useState } from "react"
import Cropper from "react-easy-crop"

const CoverPhoto = ({ user, defaultCover }) => {
    // States
    const [showCoverOptions, setShowCoverOptions] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pixelCrop, setPixelCrop] = useState(null);
    const [width, setWidth] = useState(null);

    // Redux States
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const coverOptionsRef = useRef(null);
    const inputFileRef = useRef(null);
    const coverRef = useRef(null);

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
        if(image) {
            const url = URL.createObjectURL(image);

            setImageUrl(url);

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

    return (
        <div className="pt-10">
            <div ref={coverRef} className="relative w-full h-[400px] mx-auto bg-border rounded-lg overflow-hidden">
                <div className="w-full h-full cover-photo">
                    {
                        !image ? (
                            <img src={user.coverPhoto || defaultCover} alt="Cover Photo" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Cropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={width / 400}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    objectFit="horizontal-cover"
                                />
                            </>
                        )
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