const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost, getAllPosts } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create-post", createPost);
router.get("/get-all-posts", getAllPosts);

module.exports = router;