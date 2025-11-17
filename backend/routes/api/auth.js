const express = require("express");
const { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken, getUser, updateProfilePicture, updateCoverPhoto, updateProfileIntro, addFriend, cancelRequest, follow, unFollow, acceptRequest, unFriend } = require("../../controllers/userControllers");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Authentication
router.post("/signup", newUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/findUser", findUser);
router.post("/reset-code", resetCode);
router.post("/verify-code", verifyCode);
router.post("/new-password", newPassword);

// Profile
router.get("/get-user/:username", authMiddleware, getUser);
router.put("/update-profile-picture", authMiddleware, updateProfilePicture);
router.put("/update-cover-photo", authMiddleware, updateCoverPhoto);
router.put("/update-profile-intro", authMiddleware, updateProfileIntro);

// Friend & Followers
router.post("/add-friend/:id", authMiddleware, addFriend);
router.post("/accept-request/:id", authMiddleware, acceptRequest);
router.delete("/cancel-request/:id", authMiddleware, cancelRequest);
router.post("/follow/:id", authMiddleware, follow);
router.delete("/unfollow/:id", authMiddleware, unFollow);
router.delete("/unfriend/:id", authMiddleware, unFriend);

module.exports = router;