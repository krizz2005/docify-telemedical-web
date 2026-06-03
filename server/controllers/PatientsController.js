// File Path: server/controllers/patientController.js

const User = require('../database/User');
const Appointment = require('../database/Appointment');
const Report = require('../database/Report');

// Get a list of all unique doctors a patient has had an appointment with
exports.getPatientDoctors = async (req, res) => {
  try {
    // Add a safety check for the user object
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patientId });
    const doctorIds = [...new Set(appointments.map(app => app.doctorId.toString()))];
    const doctors = await User.find({ '_id': { $in: doctorIds } }).select('name specialization');
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching patient doctors:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get a list of all unique patients for the logged-in doctor
exports.getDoctorPatients = async (req, res) => {
  try {
    // --- THE FIX ---
    // This safety check ensures that req.user exists before the code tries to use it.
    // This prevents the "Cannot read properties of undefined" crash.
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId });
    const patientIds = [...new Set(appointments.map(app => app.patientId.toString()))];
    const patients = await User.find({ '_id': { $in: patientIds } }).select('name email');
    res.json(patients);
  } catch (err) {
    console.error('Error fetching doctor patients:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get details and history for a specific patient
exports.getPatientDetails = async (req, res) => {
  try {
    // Add a safety check for the user object
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const doctorId = req.user.id;

    if (req.user.role !== 'doctor' && req.user.id.toString() !== id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const patient = await User.findById(id).select('-password');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointmentHistory = await Appointment.find({ patientId: id, doctorId: doctorId })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });

    const reportHistory = await Report.find({ patientId: id })
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
};
