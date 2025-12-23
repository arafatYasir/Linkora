const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = mongoose.Schema;

const UserModel = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        text: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        text: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        reqire: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPhoto: {
        type: String,
        default: ""
    },
    day: {
        type: Number,
        required: true,
        trim: true
    },
    month: {
        type: Number,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationTokenExpiry: {
        type: Date,
        default: null
    },
    friends: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "User",
        }
    ],
    friendRequests: [
        {
            type: ObjectId,
            ref: "User",
        }
    ],
    sentRequests: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    search: [
        {
            user: {
                type: ObjectId,
                ref: "User",
                required: true,
                text: true
            },
            createdAt: {
                type: Date,
                required: true,
            }
        }
    ],
    details: {
        bio: {
            type: String,
            default: ""
        },
        pronoun: {
            type: String,
            default: ""
        },
        job: {
            type: String,
            default: ""
        },
        currentCity: {
            type: String,
            default: ""
        },
        workPlace: {
            type: String,
            default: ""
        },
        school: {
            type: String,
            default: ""
        },
        college: {
            type: String,
            default: ""
        },
        university: {
            type: String,
            default: ""
        },
        homeTown: {
            type: String,
            default: ""
        },
        relationShip: {
            type: String,
            enum: [
                "Single",
                "In a Relationship",
                "It's Complicated",
                "Engaged",
                "Married",
                "Divorced"
            ],
            default: "Single"
        },
        gmail: {
            type: String,
            default: ""
        },
        facebook: {
            type: String,
            default: ""
        },
        x: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        youtube: {
            type: String,
            default: ""
        }
    },
    savedPosts: [
        {
            post: {
                type: ObjectId,
                ref: "post"
            },
            savedAt: {
                type: Date,
                required: true
            }
        }
    ],
    sharedPosts: [
        {
            post: {
                type: ObjectId,
                ref: "post"
            },
            caption: {
                type: String,
                default: ""
            },
            sharedAt: {
                type: Date,
                required: true
            }
        }
    ],
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserModel);