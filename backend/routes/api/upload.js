const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { uploadImage, listImages } = require("../../controllers/uploadControllers");
const uploadMiddleware = require("../../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/image", authMiddleware, uploadMiddleware, uploadImage);
router.get("/list-images", authMiddleware, listImages);

module.exports = router;