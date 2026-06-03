const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const supportController = require('../controllers/supportController');

const router = express.Router();

// Protect all admin routes and ensure only 'admin' role can access
router.use(authenticateJWT);
router.use(authorizeRole('admin'));

// =========================
// 🔹 User & Role Management
// =========================
router.get("/users", adminController.getAllUsers);
router.get("/doctors", adminController.getAllDoctors);
router.get("/patients", adminController.getAllPatients);

// ✅ CRITICAL LINE: Ensure this line uses the plural "users" and ":id"
router.delete("/users/:id", adminController.deleteUser);


// =========================
// 🔹 Doctor & Patient Management
// =========================
router.put("/doctors/:id", adminController.updateDoctorProfile);
router.put("/patients/:id/subscription", adminController.updatePatientSubscription);


// =========================
// 🔹 Support Ticket Management
// =========================
router.get("/tickets", supportController.getAllTickets);
router.put("/tickets/:id/status", supportController.updateTicketStatus);


// =========================
// 🔹 Dashboard & Subscriptions
// =========================
router.get("/stats", adminController.getStats);
router.get("/subscriptions", adminController.getSubscriptions);


// =========================
// 🔹 Doctor Approval Flow
// =========================
router.get('/pending-doctors', adminController.getPendingDoctors);
router.post('/submit-doctor-details', adminController.submitDoctorDetails);
router.put('/doctors/:id/status', adminController.updateDoctorStatus);


module.exports = router;
