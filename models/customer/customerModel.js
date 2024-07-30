const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    // contact: ,
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
