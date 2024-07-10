const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
    unique: true,
  },
});

const CustomerSchema = new mongoose.Schema(
  {
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
    contact: [ContactSchema],
  },
  { timestamps: true }
);


const Customer = mongoose.model("User", CustomerSchema)
module.exports = Customer