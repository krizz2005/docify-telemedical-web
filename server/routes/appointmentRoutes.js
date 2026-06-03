// File Path: server/routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// @route   POST api/appointments/book
// @desc    Book a new appointment
// @access  Private (Requires user to be logged in)
router.post('/book', authenticateJWT, bookAppointment);

// @route   GET api/appointments/patient/:patientId
// @desc    Get all appointments for a specific patient
// @access  Private (Requires user to be logged in)
router.get('/patient/:patientId', authenticateJWT, getAppointmentsByPatientId);

// @route   GET api/appointments/doctor
// @desc    Get all appointments for the logged-in doctor
// @access  Private (Requires user to be a doctor)
router.get('/doctor', authenticateJWT, getAppointmentsByDoctorId);

// @route   PATCH api/appointments/update-status/:id
// @desc    Update the status of an appointment (e.g., confirm, cancel)
// @access  Private
router.patch('/update-status/:id', authenticateJWT, updateAppointmentStatus);


module.exports = router;
