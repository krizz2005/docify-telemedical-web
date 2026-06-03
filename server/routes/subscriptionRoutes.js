const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
  createSubscriptionOrder,
  verifySubscription,
  getMySubscription,
  getAllSubscriptions,
} = require("../controllers/subscriptionController");

const router = express.Router();

// === PATIENT ROUTES ===
// Create a new Razorpay order for a subscription or activate free plan
router.post("/create-order", authenticateJWT, createSubscriptionOrder);

// Verify Razorpay payment and activate the subscription
router.post("/verify", authenticateJWT, verifySubscription);

// Get the current patient's subscription status
router.get("/me", authenticateJWT, getMySubscription);


// === ADMIN ROUTES ===
// Get all subscriptions in the system
router.get("/all", authenticateJWT, getAllSubscriptions);


module.exports = router;

