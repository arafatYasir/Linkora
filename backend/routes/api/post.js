const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost, getAllPosts, getUserPosts } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create-post", authMiddleware, createPost);
router.get("/get-all-posts", authMiddleware, getAllPosts);
router.get("/get-user-posts/:id", authMiddleware, getUserPosts)

module.exports = router;