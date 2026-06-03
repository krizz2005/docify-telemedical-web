const express = require('express');
const router = express.Router();
const Appointment = require('../database/Appointment');
const Report = require('../database/Report');
const User = require('../database/User');
const { authenticateJWT } = require('../middleware/authMiddleware'); // Make sure you're importing correctly
const { getPatientDetails, getDoctorPatients, getPatientDoctors } = require('../controllers/PatientsController');

router.get('/my-doctors', authenticateJWT, getPatientDoctors);
router.get('/', authenticateJWT, getDoctorPatients);
router.get('/:id', authenticateJWT, getPatientDetails);
// GET patient details (Accessible by both doctors and patients)
router.get('/:patientId', authenticateJWT, async (req, res) => {
  try {
    const { patientId } = req.params;

    // Allow only if:
    // - The logged-in user is the same patient, OR
    // - The logged-in user is a doctor
    if (req.user.role !== 'doctor' && req.user._id.toString() !== patientId) {
      return res.status(401).json({ error: 'Not authorized to view this patient details.' });
    }

    // Fetch patient info
    const patient = await User.findById(patientId).select('-password');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Fetch past appointments for this patient
    const appointmentHistory = await Appointment.find({
      patientId,
      status: { $in: ['completed', 'cancelled', 'rejected', 'confirmed'] }
    })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });

    // Fetch reports for this patient
    const reportHistory = await Report.find({ patientId })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      patient,
      appointmentHistory,
      reportHistory
    });

  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
