const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const resetCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("code", resetCodeSchema);