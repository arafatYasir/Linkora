const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost, getAllPosts, getUserPosts, reactPost, commentPost, savePost } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create-post", authMiddleware, createPost);
router.get("/get-all-posts", authMiddleware, getAllPosts);
router.get("/get-user-posts/:id", authMiddleware, getUserPosts);
router.put("/react-post", authMiddleware, reactPost);
router.post("/comment-post", authMiddleware, commentPost);
router.post("/save-post/:id", authMiddleware, savePost);

module.exports = router;