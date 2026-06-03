const express = require("express");
const { 
  createOrder, 
  verifyPaymentAndBook, 
  bookOffline 
} = require("../controllers/paymentController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Create a new Razorpay order
router.post("/create-order", authenticateJWT, createOrder);

// 🔹 Verify Razorpay payment & book appointment
router.post("/verify-payment-and-book", authenticateJWT, verifyPaymentAndBook);

// 🔹 Book appointment without payment (offline mode)
router.post("/book-offline", authenticateJWT, bookOffline);

module.exports = router;
