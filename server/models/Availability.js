// File Path: server/models/Availability.js

const mongoose = require('mongoose');

// This schema defines a single day's working hours.
const dailyScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: String, // e.g., "09:00"
    default: '09:00',
  },
  endTime: {
    type: String, // e.g., "17:00"
    default: '17:00',
  },
}, { _id: false });


// This is the main schema for a doctor's weekly availability.
const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to your User model
    required: true,
    unique: true, // Each doctor has only one availability document
  },
  schedule: [dailyScheduleSchema],
}, { timestamps: true });

// Pre-save hook to create a default weekly schedule for a new document
availabilitySchema.pre('save', function(next) {
  if (this.isNew && this.schedule.length === 0) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.schedule = days.map(day => ({ dayOfWeek: day }));
  }
  next();
});


const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
