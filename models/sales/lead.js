const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  company: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], 
    default: 'New' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
},{ timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
