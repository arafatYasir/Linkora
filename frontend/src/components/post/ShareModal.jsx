import { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdLink } from "react-icons/io";
import { FaGlobeAmericas, FaCaretDown } from "react-icons/fa"; // Icons for that Facebook "Public" dropdown look
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ShareModal = ({ onClose, handleSharePost, postLink }) => { // Added postLink prop if you want to pass the link to copy
    const { userInfo } = useSelector((state) => state.auth);
    const [caption, setCaption] = useState("");
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + postLink);
        toast.success("Link copied to clipboard!");
    };

    const onSubmit = () => {
        handleSharePost(caption);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div
                ref={modalRef}
                className="w-full max-w-lg rounded-xl shadow-lg bg-surface border border-border overflow-hidden transform transition-all"
            >
                {/* ---- Header ---- */}
                <div className="relative flex items-center justify-center px-4 py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        Share Post
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary transition-colors"
                        aria-label="Close"
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="p-4">
                    {/* User Info Section (Facebook Style) */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={userInfo?.profilePicture || "https://dummyimage.com/100x100/ccc/fff"}
                            alt={userInfo?.username}
                            className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-text-primary leading-tight">
                                {userInfo?.fullName || userInfo?.username}
                            </span>
                            {/* "Public" Badge/Dropdown lookalike */}
                            <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-bg/50 rounded-md border border-border text-xs text-text-secondary cursor-pointer hover:bg-border/50 transition-colors">
                                <FaGlobeAmericas size={10} />
                                <span>Public</span>
                                <FaCaretDown size={10} />
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="w-full mb-4">
                        <textarea
                            placeholder="Say something about this..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full min-h-[120px] bg-transparent text-lg text-text-primary placeholder:text-text-secondary/60 resize-none outline-none border-none focus:ring-0 p-0"
                            autoFocus
                        />
                    </div>

                    {/* Optional: Add Link Preview Card here if you have the data, currently just input area as requested */}

                    {/* Actions / Copy Link */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium px-2 py-1 rounded-lg bg-border/30 hover:bg-border/50 cursor-pointer"
                        >
                            <IoMdLink size={20} />
                            <span>Copy link</span>
                        </button>
                    </div>
                </div>

                {/* ---- Footer / Share Button ---- */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={onSubmit}
                        className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-[15px] hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!caption.trim()}
                    >
                        Share now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;