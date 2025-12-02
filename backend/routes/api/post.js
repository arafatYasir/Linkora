const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost, getAllPosts, getUserPosts, reactPost, commentPost } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create-post", authMiddleware, createPost);
router.get("/get-all-posts", authMiddleware, getAllPosts);
router.get("/get-user-posts/:id", authMiddleware, getUserPosts);
router.put("/react-post", authMiddleware, reactPost);
router.post("/comment-post", authMiddleware, commentPost);

module.exports = router;