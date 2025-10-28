const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["profile-picture", "cover-photo", "text-post", "image-post", "background-post", null],
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
    userId: {
        type: ObjectId,
        ref: "user"
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
                ref: "user"
            },
            commentedAt: {
                type: Date,
                require: true
            }
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model("post", postSchema);