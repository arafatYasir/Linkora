const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = mongoose.Schema;

const UserModel = new Schema({
    firstname: {
        type: String,
        require: true,
        trim: true,
        text: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true,
        text: true,
    },
    username: {
        type: String,
        require: true,
        trim: true,
        text: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
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
    },
    day: {
        type: Number,
        require: true,
        trim: true
    },
    month: {
        type: Number,
        require: true,
        trim: true
    },
    year: {
        type: Number,
        require: true,
        trim: true
    },
    gender: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: ObjectId,
            ref: "UserModel"
        }
    ],
    followers: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],
    friendRequests: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],
    search: [
        {
            user: {
                type: ObjectId,
                ref: "UserModel",
                require: true,
                text: true
            },
            createdAt: {
                type: Date,
                require: true,
            }
        }
    ],
    details: {
        bio: {
            type: String
        },
        oterName: {
            type: String
        },
        job: {
            type: String
        },
        currentCity: {
            type: String
        },
        workPlace: {
            type: String
        },
        college: {
            type: String
        },
        school: {
            type: String
        },
        homeTown: {
            type: String
        },
        relationShip: {
            type: String,
            enum: [
                "Single",
                "In a Relationship",
                "It's Complicated",
                "Married",
                "Divorced"
            ]
        },
        instagram: {
            type: String,
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
                require: true
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserModel);