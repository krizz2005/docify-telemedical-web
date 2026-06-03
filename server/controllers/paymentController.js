/**
 * Payment Controller
 * Handles Razorpay order creation, payment verification, and offline bookings.
 */
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../database/User");
const Appointment = require("../database/Appointment");

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create a new Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required." });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const amountInPaise = Math.round(doctor.consultationFee * 100);
    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid consultation fee." });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const orderFromServer = await instance.orders.create(options);

    // ✅ Frontend expects this shape
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: orderFromServer,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({
      message: "Failed to create payment order. Please try again later.",
      error: err.message,
    });
  }
};

/**
 * @desc    Verify payment and book the appointment
 * @route   POST /api/payments/verify-payment-and-book
 * @access  Private
 */
const verifyPaymentAndBook = async (req, res) => {
  try {
    const { paymentDetails, formData } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      paymentDetails;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      });
    }

    // ✅ Valid payment → create appointment
    const appointmentData = {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: new Date(formData.date),
      time: formData.time,
      mode: formData.mode,
      paymentStatus: "paid",
      paymentDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
      status: "confirmed",
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Payment verified and appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Error in verifyPaymentAndBook:", err);
    res.status(500).json({
      message: "Internal server error during appointment creation.",
      error: err.message,
    });
  }
};

/**
 * @desc    Book appointment without payment (offline mode)
 * @route   POST /api/payments/book-offline
 * @access  Private
 */
const bookOffline = async (req, res) => {
  // THIS FUNCTION HAS BEEN FULLY FIXED
  try {
    // 1. Expect a "flat" data structure
    const { doctorId, date, time, mode } = req.body;
    // 2. Securely get patientId from the login token
    const patientId = req.user._id;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required." });
    }

    // 3. Add a check to prevent double booking
    const existingAppointment = await Appointment.findOne({ doctorId, date: new Date(date), time });
    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is no longer available. Please select another time." });
    }

    // 4. Fetch the doctor's details to get the correct fee
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // 5. Create the appointment with correct values that match your schema
    const appointmentData = {
      patientId,
      doctorId,
      date: new Date(date),
      time,
      mode,
      consultationFee: doctor.consultationFee,
      paymentStatus: "unpaid", // Lowercase, matches schema enum
      status: "scheduled",   // Matches schema enum
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "In-person appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (err) {
    // 6. Add specific error handling for duplicate bookings
    if (err.code === 11000) {
        return res.status(409).json({
            message: "This time slot is no longer available. Please select another time.",
            error: "Duplicate appointment booking attempt.",
        });
    }

    // Generic error for everything else, including validation errors
    console.error("Error in bookOffline:", err.message);
    res.status(500).json({
      message: "Internal server error during offline appointment creation.",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPaymentAndBook,
  bookOffline,
};
