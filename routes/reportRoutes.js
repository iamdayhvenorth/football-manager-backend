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

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get('/sales', getSalesAnalytics);
router.get('/support', getSupportAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/reports', getReports);
router.post('/reports', createReport);
router.get('/reports/:reportId', getReportById);
router.put('/reports/:reportId', updateReport);
router.delete('/reports/:reportId', deleteReport);

module.exports = router;
