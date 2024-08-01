const express = require('express');
const {
    getSettings,
    updateSettings,
    listLogs,
    clearLogs,
    listAuditLogs,
    getBackupStatus,
    createBackup,
    restoreBackup
} = require("../controllers/settingsConfigurationCOntrollers")

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/logs', listLogs);
router.post('/logs/clear', clearLogs);
router.get('/audit', listAuditLogs);

router.get('/backup', getBackupStatus);
router.post('/backup', createBackup);
router.post('/restore', restoreBackup);

module.exports = router;