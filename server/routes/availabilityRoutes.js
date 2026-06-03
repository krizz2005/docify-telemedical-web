// File Path: server/routes/availabilityRoutes.js

const express = require('express');
const router = express.Router();
const { getAvailability, updateAvailability, getAvailableSlots } = require('../controllers/availabilityController');
const { authenticateJWT } = require('../middleware/authMiddleware'); // Your existing auth middleware

// --- Doctor-specific routes (Protected) ---
// These routes are for the logged-in doctor to manage their own schedule.
router.get('/', authenticateJWT, getAvailability);
router.post('/', authenticateJWT, updateAvailability);


// --- Public route for Patients ---
// This route is for patients to see a doctor's available slots.
// It does not need to be protected by the same middleware.
router.get('/slots', getAvailableSlots);


module.exports = router;
