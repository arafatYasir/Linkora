require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const databaseConfig = require("./database/databaseConfig");
const port = process.env.PORT;

// Connecting to mongodb
databaseConfig();

// CORS
app.use(cors());

// Routes
app.use(routes)

app.listen(port, () => {
    console.log("Running on port:", port);
});