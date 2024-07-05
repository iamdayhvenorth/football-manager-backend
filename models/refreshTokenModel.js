const mongoose = require("mongoose")

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresIn: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + (24 * 60 * 60 * 1000)),
        expires: 24 * 60 * 60
    },
})

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)

module.exports = RefreshToken