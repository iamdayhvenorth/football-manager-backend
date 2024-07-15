const Lead = require('../models/sales/lead');
const Opportunity = require('../models/sales/opportunity');
const {
  validateLead,
  validateOpportunity,
} = require('../validators/salesValidator');

const listLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLead = async (req, res) => {
  const { error } = validateLead(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLead = async (req, res) => {
  const { error } = validateLead(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.leadId, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOpportunity = async (req, res) => {
  const { error } = validateOpportunity(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const opportunity = new Opportunity(req.body);
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId);
    if (!opportunity)
      return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOpportunity = async (req, res) => {
  const { error } = validateOpportunity(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.opportunityId,
      req.body,
      { new: true }
    );
    if (!opportunity)
      return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
  listOpportunities,
  createOpportunity,
  getOpportunity,
  updateOpportunity,
};
