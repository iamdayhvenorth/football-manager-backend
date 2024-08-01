const Joi = require('joi');


const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});

const noteSchema = Joi.object({
  text: Joi.string().required()
});

const activitySchema = Joi.object({
  description: Joi.string().required(),
  date: Joi.date().optional()
});

module.exports = {
    contactSchema,
    noteSchema,
    activitySchema
}