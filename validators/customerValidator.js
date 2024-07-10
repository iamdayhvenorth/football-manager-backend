const joi = require('joi');

const Contact = joi.object({
  address: joi.string().required(),
  phone: joi.string().required(),
  email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com']}}).required(),
  dob: joi.date().iso().required(),
});

const validateCustomer = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  gender: joi.string().required().valid('male', 'female'),
  contact: Contact,
});

module.exports = validateCustomer;
