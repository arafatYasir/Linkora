import { IoIosCamera } from "react-icons/io"
import { editOptions } from "../../constants/coverPhoto"
import { useSelector } from "react-redux"
import CoverOption from "./CoverOption"
import { useEffect, useRef, useState } from "react"

const CoverPhoto = ({ user, defaultCover }) => {
    // States
    const [showCoverOptions, setShowCoverOptions] = useState(false);
    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);

    // Redux States
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const coverOptionsRef = useRef(null);
    const fileInputRef = useRef(null);

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

    return (
        <div className="pt-10">
            <div className="relative w-full h-[400px] mx-auto bg-border rounded-lg overflow-hidden">
                <img src={user.coverPhoto || defaultCover} alt="Cover Photo" className="w-full h-full object-cover" />

                {/* ---- If it is the same user then let him edit ---- */}
                {
                    userInfo._id === user._id && (
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
                                        <CoverOption key={option.id} option={option} />
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