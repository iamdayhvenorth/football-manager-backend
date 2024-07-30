const Joi = require('joi');

const validateReport = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
});

module.exports = {
  validateReport
};
