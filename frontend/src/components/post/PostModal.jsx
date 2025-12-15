import { useState } from "react";
import { FaTimes, FaImage, FaVideo, FaFileAlt, FaGlobeAmericas, FaCaretDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { backgrounds } from "../../constants/postBackgrounds";
import { useCreatePostMutation, useUploadImageMutation } from "../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import dataURIToBlob from "../../helpers/dataURIToBlob";
import { addPost } from "../../slices/postsSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import defaultPhoto from "/default images/avatar.png";

const PostModal = ({ onClose }) => {
    // States
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [background, setBackground] = useState("");
    const [showBackgrounds, setShowBackgrounds] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const dispatch = useDispatch();

    // RTK Query
    const [createPost] = useCreatePostMutation();
    const [uploadImage] = useUploadImageMutation();

    // Functions
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            let res;

            // If a post has a background then create a background post
            if (background) {
                res = await createPost({
                    type: "background-post",
                    images: null,
                    text,
                    background,
                    user: userInfo._id,
                }).unwrap();

                if (res.status === "OK") {
                    setText("");
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
                    user: userInfo._id,
                }).unwrap();

                if (res.status === "OK") {
                    setText("");
                    setFiles([]);
                    setBackground("");
                    setShowBackgrounds(false);
                    onClose();
                }
            }

            // Extracting post and pushing the userInfo on the post
            const post = { ...res.post };
            post.user = userInfo;

            // Adding the post in redux store
            dispatch(addPost({
                ...post,
                reactionsCount: {
                    Like: 0,
                    Love: 0,
                    Haha: 0,
                    Wow: 0,
                    Sad: 0,
                    Angry: 0
                },
                totalReactions: 0,
                usersReaction: null,
                comments: []
            }));

            toast.success("Post created!");
        } catch (e) {
            console.log("ERROR on submission to post: ", e.message);
            toast.error("Failed to create post!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl rounded-xl shadow-lg bg-surface border border-border overflow-hidden transform transition-all">
                {/* ---- Header ---- */}
                <div className="relative flex items-center justify-center py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        Create Post
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary transition-colors active:scale-95"
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        {/* Profile Picture & Name */}
                        <Link to={`/profile/${userInfo.username}`} className="block w-10 h-10 overflow-hidden rounded-full">
                            <img
                                src={userInfo.profilePicture || defaultPhoto}
                                alt={userInfo.firstname + " " + userInfo.lastname}
                                className="w-full h-full object-cover border"
                            />
                        </Link>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-text-primary leading-tight">
                                {userInfo.firstname + " " + userInfo.lastname}
                            </span>

                            {/* View Badge/Dropdown */}
                            <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-bg/50 rounded-md border border-border text-sm text-text-secondary cursor-pointer hover:bg-border/50 transition-colors">
                                <FaGlobeAmericas size={12} />
                                <span>Public</span>
                                <FaCaretDown size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="w-full mb-4">
                        {background ? (
                            <div className="relative">
                                <img className="w-full h-[300px] rounded-lg object-cover shadow-sm" src={background} alt="post-background" />

                                <button
                                    className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all"
                                    onClick={() => setBackground("")}
                                >
                                    <FaTimes size={16} />
                                </button>

                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    maxLength={150}
                                    placeholder="What's on your mind?"
                                    className="w-full text-2xl font-bold text-center p-4 rounded-lg text-white outline-none resize-none absolute top-1/2 left-1/2 -translate-1/2 bg-transparent placeholder:text-white/80 drop-shadow-md"
                                    rows={4}
                                />
                            </div>
                        ) : (
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={`What's on your mind, ${userInfo.firstname}?`}
                                className="w-full min-h-[140px] bg-transparent text-text-primary placeholder:text-text-secondary/60 resize-none outline-none border-none focus:ring-0 p-0 custom-scrollbar text-lg"
                                rows={4}
                                autoFocus
                            />
                        )}
                    </div>

                    {/* ---- Custom Backgrounds ---- */}
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className="w-9 h-9 cursor-pointer rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-sm hover:opacity-90 transition-all flex items-center justify-center text-white font-bold text-xs"
                            onClick={() => setShowBackgrounds(prev => !prev)}
                            title="Backgrounds"
                        >
                            Aa
                        </div>

                        {showBackgrounds && (
                            <div className="flex gap-2 animate-fade-in pl-2 overflow-x-auto pb-1 custom-scrollbar">
                                {backgrounds.map((source, index) => (
                                    <div
                                        className="w-9 h-9 min-w-[36px] cursor-pointer hover:scale-110 transition-transform"
                                        key={index}
                                        onClick={() => setBackground(source)}
                                    >
                                        <img className="w-full h-full rounded-md object-cover border border-border" src={source} alt="bg" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* ---- File Previews ---- */}
                    {files.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2 animate-fade-in">
                            {files.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-24 h-24 border border-border rounded-lg overflow-hidden flex items-center justify-center bg-bg"
                                >
                                    {file.type.startsWith("image") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : file.type.startsWith("video") ? (
                                        <video src={URL.createObjectURL(file)} className="object-cover w-full h-full" />
                                    ) : (
                                        <FaFileAlt className="w-8 h-8 text-text-secondary" />
                                    )}
                                    <button
                                        onClick={() => handleRemoveFile(idx)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-transition-default"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* ---- Add to Post (Upload buttons) ---- */}
                    <div className="flex items-center justify-between px-4 py-3 border border-border rounded-lg shadow-sm">
                        <span className="text-text-primary font-semibold text-[15px]">Add to your post</span>

                        <div className="flex items-center gap-1">
                            <label className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-bg cursor-pointer text-green-500 transition-colors" title="Photo">
                                <FaImage size={24} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            <label className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-bg cursor-pointer text-blue-500 transition-colors" title="Video">
                                <FaVideo size={24} />
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            <label className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-bg cursor-pointer text-purple-500 transition-colors" title="File">
                                <FaFileAlt size={22} />
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* ---- Footer / Submit button ---- */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleSubmit}
                        disabled={text === "" && files.length === 0 && !background}
                        className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;