const express = require("express");
const { newUser, verifyUser, loginUser, reVerification } = require("../../controllers/userControllers");
const authMiddleware = require("../../middlewares/authMiddleware")

const router = express.Router();

router.post("/signup", newUser);
router.post("/verify", verifyUser);
router.post("/re-verification", reVerification)
router.post("/login", loginUser);

module.exports = router;