const mongoose = require("mongoose");
const { ObjectId, } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["profile-picture", "cover-photo", "text-post", "image-post", "background-post", "shared-post", null],
        default: null
    },
    images: {
        type: Array,
    },
    text: {
        type: String,
    },
    background: {
        type: String,
    },
    user: {
        type: ObjectId,
        ref: "User"
    },
    sharedPost: {
        type: ObjectId,
        ref: "Post"
    },
    comments: [
        {
            comment: {
                type: String,
            },
            image: {
                type: String
            },
            commentedBy: {
                type: ObjectId,
                ref: "User"
            },
            commentedAt: {
                type: Date,
                require: true
            }
        }
    ],
    reacts: [
        {
            react: {
                type: String,
                enum: ["Like", "Love", "Haha", "Wow", "Angry", "Sad"],
                required: true
            },
            reactedBy: {
                type: ObjectId,
                ref: "User"
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);