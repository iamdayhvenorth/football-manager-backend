const Joi = require('joi');

const ticketSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('open', 'in progress', 'closed').required()
});

const commentSchema = Joi.object({
  text: Joi.string().required(),
  author: Joi.string().required()
});

module.exports = {
  ticketSchema,
  commentSchema
};
