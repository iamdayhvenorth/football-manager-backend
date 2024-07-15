const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  value: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed Won', 'Closed Lost'],
    default: 'Open',
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
