const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// UPDATED: Destructuring the exported object from the middleware file
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Import Models
const Appointment = require('../database/Appointment');
const Report = require('../database/Report');

// Import Controllers
const {
  getAppointmentsForDoctor,
  updateAppointmentStatus,
  getAllDoctors,
  getMyPatients,
  uploadProfileImage,
  updateDoctorProfile
} = require('../controllers/doctorController');

/* ---------------- Multer Configuration for Profile Uploads ---------------- */
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* ---------------- ROUTE DEFINITIONS ---------------- */

// Get all doctors (Public)
router.get('/', getAllDoctors);

// Get all appointments for the logged-in doctor (Protected)
router.get('/appointments', authenticateJWT, authorizeRole('doctor'), getAppointmentsForDoctor);

// Get all patients for the logged-in doctor (Protected)
router.get('/my-patients', authenticateJWT, authorizeRole('doctor'), getMyPatients);

// Update appointment status (Protected)
router.patch('/appointments/:id/status', authenticateJWT, authorizeRole('doctor'), updateAppointmentStatus);

// Upload profile image (Protected)
router.post(
  '/upload-profile-image/:id',
  authenticateJWT,
  authorizeRole('doctor'),
  upload.single('profileImage'),
  uploadProfileImage
);

// Update the logged-in doctor's profile (Protected)
router.put('/profile', authenticateJWT, authorizeRole('doctor'), updateDoctorProfile);


/* ---------------- Doctor Stats Route ---------------- */
// Return doctor stats: total patients & new reports
router.get('/stats', authenticateJWT, authorizeRole('doctor'), async (req, res) => {
  try {
    const doctorId = req.user.id;

    // Count unique patients assigned to this doctor
    const patients = await Appointment.distinct('patientId', { doctorId });
    const totalPatients = patients.length;

    // Count reports uploaded for this doctor that are unread/new
    const newReports = await Report.countDocuments({ doctorId, status: 'pending' }); // Assuming a 'status' field

    res.json({ totalPatients, newReports });
  } catch (err) {
    console.error('Error in /stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

