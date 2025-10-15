const express = require("express");
const { newUser, verifyUser } = require("../../controllers/userControllers");
const router = express.Router();

router.post("/signup", newUser);
router.post("/verify", verifyUser);

module.exports = router;