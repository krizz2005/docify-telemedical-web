const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    profileImage: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
    },

    // --- Doctor-specific Fields ---
    specialization: { type: String },
    consultationFee: { type: Number, default: 0 }, // FIX: Renamed from 'fee'
    clinicLocation: {
      address: { type: String, default: '', trim: true },
      latitude: { type: Number },
      longitude: { type: Number }
    },
    availableTime: {
      type: String,
      default: '',
      trim: true,
    },

    // --- Patient-specific Fields ---
    subscription: {
      type: String,
      enum: ['Free', 'Premium'], // Adjusted to match frontend
      default: 'Free',
    },
  },
  {
    timestamps: true, // This adds createdAt & updatedAt fields
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;