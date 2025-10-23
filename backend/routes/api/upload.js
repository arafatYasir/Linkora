const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { uploadImage } = require("../../controllers/uploadControllers");
const uploadMiddleware = require("../../middlewares/uploadMiddleware");
const router = express.Router();


router.post("/image", uploadMiddleware, uploadImage);

module.exports = router;