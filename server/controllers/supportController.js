const SupportTicket = require("../database/SupportTicket");

// Create ticket (Patient or Doctor)
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const newTicket = await SupportTicket.create({
      user: req.user._id, // FIX: Was `userId`
      userRole: req.user.role,
      subject,
      description,
      priority,
    });
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: "Error creating ticket" });
  }
};
// Get tickets for logged-in user
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
};

// Admin: Get all tickets
// controllers/supportController.js

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate(
      "user", // FIX: Was "userId"
      "name email role"
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all tickets" });
  }
};

// Admin: Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error updating ticket" });
  }
};
