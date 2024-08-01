const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { 
        type: String, 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps: true});


const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
  