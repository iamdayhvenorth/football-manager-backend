const Report = require('../models/report');
const { validateReport } = require('../validators/analyticsValidator');

const getDashboardData = async (req, res) => {
  try {
    // to be done
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesAnalytics = async (req, res) => {
  try {
    // to be done
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupportAnalytics = async (req, res) => {
  try {
    // to be done
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerAnalytics = async (req, res) => {
  try {
    // to be done
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const { error } = validateReport.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { error } = validateReport.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      req.body,
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getSalesAnalytics,
  getSupportAnalytics,
  getCustomerAnalytics,
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
};
