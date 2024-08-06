const express = require('express');
const {
  getDashboardData,
  getSalesAnalytics,
  getSupportAnalytics,
  getCustomerAnalytics,
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/activityController');
const authenticateUser = require("../middlewares/authenticateUser")

const router = express.Router();

router.get('/dashboard', authenticateUser, getDashboardData);
router.get('/sales', authenticateUser, getSalesAnalytics);
router.get('/support', authenticateUser, getSupportAnalytics);
router.get('/customers', authenticateUser, getCustomerAnalytics);
router.get('/reports', authenticateUser, getReports);
router.post('/reports', authenticateUser, createReport);
router.get('/reports/:reportId', authenticateUser, getReportById);
router.put('/reports/:reportId', authenticateUser, updateReport);
router.delete('/reports/:reportId', authenticateUser, deleteReport);

module.exports = router;
