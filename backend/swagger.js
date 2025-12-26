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
                url: "http://localhost:8000/api/v1",
            }
        ],
        components: {
            schemas: {
                SignupInput: {
                    type: "object",
                    required: [
                        "firstname",
                        "lastname",
                        "email",
                        "password",
                        "day",
                        "month",
                        "year",
                        "gender"
                    ],
                    properties: {
                        firstname: {
                            type: "string",
                            example: "John"
                        },
                        lastname: {
                            type: "string",
                            example: "Doe"
                        },
                        email: {
                            type: "string",
                            example: "john@example.com"
                        },
                        password: {
                            type: "string",
                            example: "password123"
                        },
                        day: {
                            type: "number",
                            example: 1
                        },
                        month: {
                            type: "number",
                            example: 1
                        },
                        year: {
                            type: "number",
                            example: 2000
                        },
                        gender: {
                            type: "string",
                            enum: ["Male", "Female", "Other"],
                            example: "Male",
                            description: "Gender must be Male, Female or Other."
                        }
                    }
                },
                SignupSuccess: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Registration successful! Please verify your email."
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Can't create a user."
                        }
                    }
                }
            }
        },
    },
    apis: ["./routes/api/*.js"],
};

module.exports = swaggerJsdoc(options);