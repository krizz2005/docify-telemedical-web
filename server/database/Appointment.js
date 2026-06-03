// File Path: server/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
  type: String,
  default: null,
    },
    meetingLink: {
  type: String,
  default: null,
},
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected','scheduled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'Unpaid',
    },
    consultationFee: {
      type: Number,
      default: 0, // Will be filled from doctor profile
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
