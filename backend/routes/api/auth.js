const express = require("express");
const { newUser, verifyUser, loginUser } = require("../../controllers/userControllers");
const router = express.Router();

router.post("/signup", newUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);

module.exports = router;