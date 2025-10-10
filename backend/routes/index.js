const express = require("express");
const router = express.Router();
const api = require("./api/index");

const BASE_API_URL = process.env.BASE_API_URL;

router.use(BASE_API_URL, api)

module.exports = router;