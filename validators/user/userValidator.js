const joi = require("joi")

const validateUser = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    password: joi.string().required().min(6),
    email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com']}}).required(),
    dob: joi.date().iso().required(),
    gender: joi.string().required().valid("male","female")
})

module.exports = validateUser
