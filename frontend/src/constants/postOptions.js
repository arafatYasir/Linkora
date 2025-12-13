import {
    FaEdit,            // Edit Post
    FaTrash,           // Delete Post
    FaThumbtack,       // Pin to Profile
    FaCommentSlash,    // Turn Off Comments
    FaEyeSlash,        // Hide Likes / Hide Comments
    FaGlobe,           // Change Visibility
    FaBookmark,        // Save Post
    FaShare,           // Share Post
    FaUserSlash,       // Hide all from this user
    FaLink             // Copy Link
} from "react-icons/fa";

export const postOptions = {
    creator: [
        { id: 1, name: "Edit Post", icon: FaEdit },
        { id: 2, name: "Delete Post", icon: FaTrash },
        { id: 3, name: "Pin to Profile", icon: FaThumbtack },
        { id: 4, name: "Turn Off Comments", icon: FaCommentSlash },
        { id: 5, name: "Hide Likes", icon: FaEyeSlash },
        { id: 6, name: "Change Visibility", icon: FaGlobe },
    ],
    visitor: [
        { id: 1, name: "Save Post", icon: FaBookmark },
        { id: 2, name: "Hide Post", icon: FaEyeSlash },
        { id: 3, name: "Hide all from this user", icon: FaUserSlash },
        { id: 4, name: "Copy Link", icon: FaLink },
    ]
};