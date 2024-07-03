const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { type } = require("../validators/userValidator")
const { required } = require("joi")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: [6, "Minimum password should be 6 characters"]
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female",]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Manager", "Sales Representative"],
        default: "Sales Representative"
    },
},{timestamps: true})

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password,salt)
    this.password = hashedPassword
})

const User = mongoose.model("User", userSchema)
module.exports = User





