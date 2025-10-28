const express = require("express");
const { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken} = require("../../controllers/userControllers");
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

module.exports = router;