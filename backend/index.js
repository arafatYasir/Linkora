require("dotenv").config();

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const databaseConfig = require("./database/databaseConfig");
const port = process.env.PORT;

// Connecting to mongodb
databaseConfig();

// CORS
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp")
}));
app.use(cookieParser())
app.use(express.json());

// Routes
app.use(routes);

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
    console.log("Running on port:", port);
});