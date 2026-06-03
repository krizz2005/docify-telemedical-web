const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportRequest', supportSchema);