const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
