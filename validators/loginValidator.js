const joi = require("joi")

const validateLogin = joi.object({
    email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com']}}).required(),
    password: joi.string().required().min(6),
})

module.exports = validateLogin