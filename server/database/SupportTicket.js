const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // renamed to `user` for populate()
  userRole: { type: String, enum: ["patient", "doctor"], required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true }, // was message before
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["open", "pending", "resolved", "closed"], default: "open" },
  attachment: { type: String }, // optional file path for uploads
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
