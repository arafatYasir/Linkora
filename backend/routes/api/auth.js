const express = require("express");
const { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken, getUser} = require("../../controllers/userControllers");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", newUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/findUser", findUser);
router.post("/reset-code", resetCode);
router.post("/verify-code", verifyCode);
router.post("/new-password", newPassword);
router.get("/get-user/:username", getUser);

module.exports = router;