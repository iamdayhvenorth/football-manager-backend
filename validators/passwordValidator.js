const joi = require("joi")

const validatePassword = joi.object({
    newPassword: joi.string().required().min(6),
    confirmNewPassword: joi.string().required().min(6),
})

module.exports = validatePassword