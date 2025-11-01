const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { uploadImage, listImages } = require("../../controllers/uploadControllers");
const uploadMiddleware = require("../../middlewares/uploadMiddleware");
const router = express.Router();


router.post("/image", uploadMiddleware, uploadImage);
router.get("/list-images", listImages);

module.exports = router;