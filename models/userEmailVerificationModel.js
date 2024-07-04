const { required } = require("joi");
const mongoose = require("mongoose")

const emailVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + (20 * 60 * 1000)), // 30 minutes from now new Date(Date.now() + (2 * 60 * 1000))
        expires: 20 * 60 // 20 minutes expiration in seconds
    }
})

const EmailVerification = mongoose.model("EmailToken", emailVerificationSchema)

module.exports = EmailVerification;