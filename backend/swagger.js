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
                            example: "Something went wrong! Please try again later."
                        }
                    }
                },
                VerifyInput: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "your-verification-token"
                        }
                    }
                },
                VerifySuccess: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Email is verified successfully!"
                        }
                    }
                },
                LoginInput: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            example: "john@example.com"
                        },
                        password: {
                            type: "string",
                            example: "password123"
                        }
                    }
                },
                LoginSuccess: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Login successful!"
                        },
                        _id: {
                            type: "string",
                            example: "2KDKOE25AS630"
                        },
                        email: {
                            type: "string",
                            example: "john@example.com"
                        },
                        username: {
                            type: "string",
                            example: "JohnDoe23"
                        },
                        profilePicture: {
                            type: "string",
                            example: "https://example.com/profile.jpg"
                        },
                        coverPhoto: {
                            type: "string",
                            example: "https://example.com/cover.jpg"
                        },
                        firstname: {
                            type: "string",
                            example: "John"
                        },
                        lastname: {
                            type: "string",
                            example: "Doe"
                        },
                        verified: {
                            type: "boolean",
                            example: true
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
                            example: "Male"
                        },
                        friends: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "2KDKOE25AS630"
                            }
                        },
                        followers: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "2KDKOE25AS630"
                            }
                        },
                        following: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "2KDKOE25AS630"
                            }
                        },
                        friendRequests: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "2KDKOE25AS630"
                            }
                        },
                        details: {
                            type: "object",
                            properties: {
                                bio: {
                                    type: "string",
                                    example: "I am a software developer."
                                },
                                pronoun: {
                                    type: "string",
                                    example: "He"
                                },
                                job: {
                                    type: "string",
                                    example: "Software Developer"
                                },
                                currentCity: {
                                    type: "string",
                                    example: "New York, USA"
                                },
                                workPlace: {
                                    type: "string",
                                    example: "Amazon, USA"
                                },
                                school: {
                                    type: "string",
                                    example: "Harvard University, USA"
                                },
                                college: {
                                    type: "string",
                                    example: "Harvard University, USA"
                                },
                                university: {
                                    type: "string",
                                    example: "Harvard University, USA"
                                },
                                homeTown: {
                                    type: "string",
                                    example: "New York, USA"
                                },
                                relationShip: {
                                    type: "string",
                                    example: "Single"
                                },
                                gmail: {
                                    type: "string",
                                    example: "john@gmail.com"
                                },
                                facebook: {
                                    type: "string",
                                    example: "https://www.facebook.com/john"
                                },
                                x: {
                                    type: "string",
                                    example: "https://x.com/john"
                                },
                                instagram: {
                                    type: "string",
                                    example: "https://www.instagram.com/john"
                                },
                                github: {
                                    type: "string",
                                    example: "https://github.com/john"
                                },
                                youtube: {
                                    type: "string",
                                    example: "https://www.youtube.com/john"
                                }
                            }
                        },
                        savedPosts: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "2KDKOE25AS630"
                            }
                        },
                        accessToken: {
                            type: "string",
                            example: "your-access-token"
                        }
                    }
                }
            }
        },
    },
    apis: ["./routes/api/*.js"],
};

module.exports = swaggerJsdoc(options);