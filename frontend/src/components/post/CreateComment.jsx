import { useSelector } from "react-redux";
import defaultAvatar from "../../../public/default images/avatar.png"
import { MdEmojiEmotions } from 'react-icons/md';
import { LuFiles } from 'react-icons/lu';
import { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateComment = ({ comment, setComment, commentFile, setCommentFile, commentRef }) => {
    // States
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const fileInputRef = useRef(null);

    // Functions
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (file.size > 1024 * 1024 * 10) {
            alert("File size can't be more than 10 MB.");
            return;
        }

        console.log(file.type.startsWith("image"));
        setCommentFile(file);
    }

    return (
        <div className="mt-4 border-t pt-2 border-[var(--color-border)]">
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={userInfo.profilePicture || defaultAvatar}
                        alt={userInfo.firstname + " " + userInfo.lastname + "Profile Picture"}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-[90%] relative">
                    {/* File Input */}
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileUpload}
                    />
                    {/* Text Input */}
                    <input
                        type="text"
                        placeholder={`${userInfo.firstname} write a public comment...`}
                        className="w-full border border-[var(--color-border)] py-[7px] px-4 rounded-full focus:outline-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                    />

                    <div className="flex items-center gap-x-4 absolute top-1/2 right-4 -translate-y-1/2">
                        <MdEmojiEmotions
                            size={22}
                            className="cursor-pointer"
                            onClick={() => setShowEmojiPicker(prev => !prev)}
                        />

                        <LuFiles
                            size={22}
                            className="cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        />
                    </div>
                </div>
            </div>

            {/* ---- File Preview ---- */}
            {
                commentFile && (
                    <div className="w-30 h-30 mt-2 overflow-hidden relative left-16 rounded-xl group">
                        {
                            commentFile.type.startsWith("image") ? (
                                <img src={URL.createObjectURL(commentFile)} alt="Preview" className="object-cover w-full h-full group-hover:opacity-40" />
                            ) : commentFile.type.startsWith("video") ? (
                                <video src={URL.createObjectURL(commentFile)} autoPlay={false} controls className="w-full h-full"></video>
                            ) : <></>
                        }

                        
                        {/* Close Icon */}
                        <FaTimes size={18} className="text-bg bg-text-primary rounded-full absolute top-1 right-1 cursor-pointer p-0.5" onClick={() => setCommentFile(null)} />
                    </div>
                )
            }
        </div>
    )
}

export default CreateComment