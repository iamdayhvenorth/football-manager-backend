const mongoose = require("mongoose")

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
})

const Token = mongoose.model("Token",TokenSchema)

module.exports = Token