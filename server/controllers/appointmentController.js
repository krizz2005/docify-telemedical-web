const Appointment = require('../database/Appointment'); // Standard path is /models, adjust if needed
const User = require('../database/User'); // Standard path is /models, adjust if needed

/**
 * @desc    Book a new appointment without online payment (Pay at Clinic)
 * @route   POST /api/appointments/book
 */
// controllers/appointmentController.js
// controllers/appointmentController.js
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, mode } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !patientId || !date || !time || !mode) {
      return res.status(400).json({ message: 'All fields are required for booking.' });
    }

    // Fetch doctor details to get consultation fee
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      time,
      mode,
      status: 'pending',
      paymentStatus: mode === 'offline' ? 'Unpaid' : 'Unpaid', // ✅ will be updated to Paid after Razorpay success
      consultationFee: doctor.consultationFee || 0,
    });

    res.status(201).json({
      message: 'Appointment request sent! Awaiting confirmation from the doctor.',
      appointment,
    });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Server error during booking.', error: err.message });
  }
};

exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.role === 'patient' && req.user.id.toString() !== patientId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name specialization profileImage consultationFee')
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments.' });
  }
};
exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name email profileImage')
      .populate('doctorId', 'consultationFee')
      .sort({ date: 1, time: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching doctor's appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const doctorId = req.user.id;

  const allowedStatuses = ['confirmed', 'cancelled', 'completed', 'pending', 'rejected'];

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'A valid status is required.' });
  }

  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctorId: doctorId },
      updateData,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or you do not have permission.' });
    }

    res.status(200).json({ message: 'Appointment updated successfully.', appointment });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: 'Server error while updating status.', error: err.message });
  }
};