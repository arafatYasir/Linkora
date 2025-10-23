const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const { createPost } = require("../../controllers/postControllers");

const router = express.Router();

router.post("/create", createPost);

module.exports = router;