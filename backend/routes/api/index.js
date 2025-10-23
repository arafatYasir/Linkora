const express = require("express");
const router = express.Router();
const auth = require("./auth");
const post = require("./post");
const upload = require("./upload");
const uploadMiddleware = require("../../middlewares/uploadMiddleware");

router.use("/", auth);
router.use("/posts", post);
router.use("/upload", upload);

module.exports = router;