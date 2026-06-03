const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require("../controllers/supportController");

const router = express.Router();

// Patient/Doctor routes
router.post("/", authenticateJWT, createTicket);
router.get("/my-tickets", authenticateJWT, getMyTickets);

// Admin routes
router.get("/", authenticateJWT, getAllTickets);
router.put("/:id/status", authenticateJWT, updateTicketStatus);

module.exports = router;
