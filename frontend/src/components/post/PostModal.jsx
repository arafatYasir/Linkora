import { useState } from "react";
import { FaTimes, FaImage, FaVideo, FaFileAlt } from "react-icons/fa";
import { backgrounds } from "../../constants/postBackgrounds";
import { useCreatePostMutation, useUploadImageMutation } from "../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import dataURIToBlob from "../../helpers/dataURIToBlob";
import { refreshToken } from "../../../api/refreshToken";
import { setUser } from "../../slices/authSlice";

const PostModal = ({ onClose }) => {
    // States
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [background, setBackground] = useState("");
    const [showBackgrounds, setShowBackgrounds] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const dispatch = useDispatch();

    // RTK Query
    const [createPost, { isLoading }] = useCreatePostMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            let res;

            // If a post has a background then create a background post
            if (background) {
                res = await createPost({
                    type: "background-post",
                    images: null,
                    text,
                    background,
                    userId: userInfo.id,
                }).unwrap();

                if (res.status === "OK") {
                    alert(res.message);
                    setText("");
                    setFiles([]);
                    setBackground("");
                    setShowBackgrounds(false);
                    onClose();
                }
            }
            else {
                if ((!text || text.trim() === "") && files.length === 0) {
                    alert("Post cannot be empty");
                    return;
                }

                let imageUrls = [];

                if (files && files.length !== 0) {
                    const postImages = await Promise.all(files.map(file => dataURIToBlob(file)));
                    const path = `${userInfo.username}/posts/${Date.now()}`;
                    const formData = new FormData();

                    postImages.forEach(image => (
                        formData.append("files", image)
                    ));

                    formData.append("path", path);

                    // upload images first to cloudinary
                    const uploadResponse = await uploadImage({
                        formData,
                    }).unwrap();

                    imageUrls = uploadResponse.images.map(img => img.url);
                }

                // creating the post with or without the images
                res = await createPost({
                    type: imageUrls.length > 0 ? "image-post" : "text-post",
                    images: imageUrls.length > 0 ? imageUrls : null,
                    text,
                    background: null,
                    userId: userInfo.id,
                }).unwrap();

                console.log("Post creation response with images: ", res);

                if (res.status === "OK") {
                    alert(res.message);
                    setText("");
                    setFiles([]);
                    setBackground("");
                    setShowBackgrounds(false);
                    onClose();
                }
            }
        } catch (e) {
            console.log("ERROR on submission to post: ", e.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-[var(--color-surface)] w-full max-w-xl rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] p-6 relative transition-[var(--transition-default)]">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-[var(--transition-default)]"
                >
                    <FaTimes size={24} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">Create Post</h2>

                {/* Textarea */}
                <div>
                    {background ? (
                        <div className="relative">
                            <img className="w-full h-[300px]" src={background} alt="post-background" />

                            <FaTimes size={20} className="absolute top-2 right-2 hover:text-black cursor-pointer" onClick={() => setBackground("")} />

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={150}
                                placeholder="What's on your mind?"
                                className="w-full text-2xl font-semibold text-center p-4 rounded-lg text-white outline-none resize-none transition-[var(--transition-default)] absolute top-1/2 left-1/2 -translate-1/2 bg-transparent placeholder:text-white"
                                rows={4}
                            />
                        </div>
                    ) : (
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none mb-4 transition-[var(--transition-default)]"
                            rows={4}
                        />
                    )}
                </div>

                {/* ---- Custom Backgrounds ---- */}
                <div className="my-4 flex justify-between">
                    <div
                        className="w-10 h-10 cursor-pointer bg-cyan-200 rounded-lg"
                        onClick={() => setShowBackgrounds(prev => !prev)}
                    >

                    </div>

                    {showBackgrounds && (
                        backgrounds.map((source, index) => (
                            <div
                                className="w-10 h-10 cursor-pointer"
                                key={index}
                                onClick={() => setBackground(source)}
                            >
                                <img className="w-full h-full rounded-lg" src={source} alt="post-background" />
                            </div>
                        ))
                    )}
                </div>

                <hr />


                {/* File Previews */}
                {files.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                            <div
                                key={idx}
                                className="relative w-24 h-24 border border-[var(--color-border)] rounded-lg overflow-hidden flex items-center justify-center bg-[var(--color-bg)]"
                            >
                                {file.type.startsWith("image") ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : file.type.startsWith("video") ? (
                                    <video src={URL.createObjectURL(file)} className="object-cover w-full h-full" autoPlay={false} controls />
                                ) : (
                                    <FaFileAlt className="w-8 h-8 text-[var(--color-text-secondary)]" />
                                )}
                                <button
                                    onClick={() => handleRemoveFile(idx)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-[var(--transition-default)]"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload buttons */}
                <div className="flex items-center justify-between my-4 text-[var(--color-text-secondary)]">
                    <label className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-[var(--color-primary-hover)] transition-[var(--transition-default)]">
                        <FaImage size={20} />
                        <span>Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-green-400 hover:text-[var(--color-primary-hover)] transition-[var(--transition-default)]">
                        <FaVideo size={20} />
                        <span>Video</span>
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-purple-400 hover:text-[var(--color-primary-hover)] transition-[var(--transition-default)]">
                        <FaFileAlt size={20} />
                        <span>File</span>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={text === "" && files.length === 0 && !background}
                    className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-[var(--transition-default)] disabled:bg-gray-300"
                >
                    {isLoading || isUploading ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
};

export default PostModal;