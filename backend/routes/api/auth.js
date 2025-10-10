const express = require("express");
const router = express.Router();

router.get("/auth", (req, res) => {
    res.send("HELLO FROM Auth ROUTE.");
});

module.exports = router;