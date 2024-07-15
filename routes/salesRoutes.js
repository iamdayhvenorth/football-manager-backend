const {
  listLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
  listOpportunities,
  createOpportunity,
  getOpportunity,
  updateOpportunity,
} = require('../controllers/salesController');
const authenticateUser = require("../middlewares/authenticateUser")

const express = require('express');
const router = express.Router();

router
  .route('/leads')
  .get(authenticateUser, listLeads)
  .post(authenticateUser, createLead);

router.route('/leads/:leadId')
  .get(authenticateUser, getLead)
  .put(authenticateUser, updateLead)
  .delete(authenticateUser, deleteLead);

router
  .route('/opportunities')
  .get(authenticateUser, listOpportunities)
  .post(authenticateUser, createOpport