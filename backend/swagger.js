const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Linkora API's",
            version: "1.0.0",
            description: "Linkora API's documentation",
        },
        servers: [
            {
                url: "http://localhost:8000/api",
            }
        ],
        components: {},

    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);