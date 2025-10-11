const express = require("express");
const { newUser } = require("../../controllers/userControllers");
const router = express.Router();

router.post("/", newUser);

module.exports = router;