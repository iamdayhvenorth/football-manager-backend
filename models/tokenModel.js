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
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + (20 * 60 * 1000)), // 20 minutes from now new Date(Date.now() + (2 * 60 * 1000))
        expires: 20 * 60 // 20 minutes expiration in seconds
    }
})

const Token = mongoose.model("Token",TokenSchema)

module.exports = Token