// server/database/Subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["Free", "Standard", "Premium"],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
});

module.exports = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
