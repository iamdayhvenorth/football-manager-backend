const Settings = require("../models/settings/settings");
const Log = require("../models/settings/log")
const AuditLog = require('../models/settings/audit')
const { validationResult } = require('express-validator');
const schedule = require('node-schedule');

const getSettings = async (req, res) => {
    try {
      const settings = await Settings.find();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};


const updateSettings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { key, value } = req.body;
      const setting = await Settings.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
      res.json(setting);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};


const listLogs = async (req, res) => {
    try {
      const logs = await Log.find();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
const clearLogs = async (req, res) => {
    try {
      await Log.deleteMany();
      res.json({ message: 'Logs cleared' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
 
const listAuditLogs = async (req, res) => {
    try {
      const auditLogs = await AuditLog.find();
      res.json(auditLogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
const getBackupStatus = async (req, res) => {
    // to be done
    res.json({ status: 'Backup status endpoint' });
};
  
const createBackup = async (req, res) => {
        // to be done
    res.json({ message: 'Backup created' });
};
  
const restoreBackup = async (req, res) => {
        // to be done
    res.json({ message: 'Backup restored' });
};

// Schedule a job to clear logs periodically (example: daily at midnight)
schedule.scheduleJob('0 0 * * *', async () => {
    try {
      await Log.deleteMany();
      logger.info('Scheduled log clearance executed');
    } catch (err) {
      logger.error('Error during scheduled log clearance', err);
    }
});




module.exports = {
    getSettings,
    updateSettings,
    listLogs,
    clearLogs,
    listAuditLogs,
    getBackupStatus,
    createBackup,
    restoreBackup
}
  