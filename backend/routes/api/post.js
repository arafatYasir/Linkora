const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost, getAllPosts, getUserPosts, reactPost, commentPost, savePost, deletePost, sharePost } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create-post", authMiddleware, createPost);
router.get("/get-all-posts", authMiddleware, getAllPosts);
router.get("/get-user-posts/:id", authMiddleware, getUserPosts);
router.put("/react-post", authMiddleware, reactPost);
router.post("/comment-post", authMiddleware, commentPost);
router.post("/save-post/:id", authMiddleware, savePost);
router.delete("/delete-post/:id", authMiddleware, deletePost);
router.post("/share-post", authMiddleware, sharePost);

module.exports = router;