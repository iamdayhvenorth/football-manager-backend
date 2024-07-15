const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
