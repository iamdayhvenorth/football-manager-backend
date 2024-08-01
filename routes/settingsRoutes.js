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
const authenticateUser = require("../middlewares/authenticateUser")

const router = express.Router();

router.get('/',authenticateUser, getSettings);
router.put('/',authenticateUser, updateSettings);
router.get('/logs',authenticateUser, listLogs);
router.post('/logs/clear',authenticateUser, clearLogs);
router.get('/audit',authenticateUser, listAuditLogs);

router.get('/backup',authenticateUser, getBackupStatus);
router.post('/backup',authenticateUser, createBackup);
router.post('/restore',authenticateUser, restoreBackup);

module.exports = router;