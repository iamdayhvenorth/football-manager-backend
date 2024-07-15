const Joi = require('joi');

const validateLead = (lead) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost').optional(),
  });

  return schema.validate(lead);
};

const validateOpportunity = (opportunity) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    value: Joi.number().required(),
    status: Joi.string().valid('Open', 'Closed Won', 'Closed Lost').optional(),
    lead: Joi.string().optional(), 
  });

  return schema.validate(opportunity);
};
module.exports = {
  validateLead,
  validateOpportunity
};