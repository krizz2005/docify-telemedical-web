// File: client/src/pages/Patient/BookAppointment.jsx

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FiCalendar, FiClock, FiUser, FiArrowRight, FiVideo, FiMapPin,
  FiHome, FiUserCheck, FiUpload, FiFileText, FiStar, FiLogOut, FiDollarSign
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000";

export default function BookAppointment() {
  // --- STATE ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "", date: "", time: "", mode: "offline",
  });
  const [paymentOption, setPaymentOption] = useState("payLater");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // --- FETCH DOCTORS ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/doctors`);
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setErrorMessage("Could not load the list of doctors.");
      }
    };
    fetchDoctors();
  }, []);

  // --- FETCH AVAILABLE SLOTS ---
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (formData.doctorId && formData.date) {
        setLoadingSlots(true);
        setAvailableSlots([]);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/availability/slots`, {
            params: { doctorId: formData.doctorId, date: formData.date },
          });
          setAvailableSlots(data);
        } catch (err) {
          console.error("Failed to fetch slots:", err);
          setErrorMessage("Could not fetch slots for this day.");
        } finally {
          setLoadingSlots(false);
        }
      }
    };
    fetchAvailableSlots();
  }, [formData.doctorId, formData.date]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value, time: "" };
    setFormData(newFormData);

    if (name === "doctorId") {
      setSelectedDoctor(doctors.find((doc) => doc._id === value) || null);
    }
  };

  const handleTimeSlotClick = (slot) => {
    setFormData((prev) => ({ ...prev, time: slot }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- HELPERS ---
  const resetForm = () => {
    setFormData({ doctorId: "", date: "", time: "", mode: "offline" });
    setSelectedDoctor(null);
    setAvailableSlots([]);
    setPaymentOption("payLater");
  };

  // --- BOOKING FUNCTIONS ---
  const bookOfflineAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/api/payments/book-offline`,
        { ...formData, patientId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage(data.message || "Appointment booked! Pay at clinic.");
      resetForm();
      navigate("/patient/my-appointments", { state: { message: data.message } });
    } catch (err) {
      console.error("Offline booking error:", err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const verifyPaymentAndBook = async (paymentData) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/api/payments/verify-payment-and-book`,
        {
          formData: { ...formData, patientId: user._id },
          paymentDetails: paymentData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      navigate("/patient/my-appointments", {
        state: { message: data.message || "Payment successful! Appointment confirmed." },
      });
    } catch (err) {
      console.error("Verification/Booking error:", err);
      setErrorMessage(err.response?.data?.message || "Payment verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPaymentFlow = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data: responseData } = await axios.post(
        `${API_BASE_URL}/api/payments/create-order`,
        { doctorId: formData.doctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { key, order } = responseData;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Docify+ Appointment",
        description: `Consultation with Dr. ${selectedDoctor.name}`,
        order_id: order.id,
        handler: (response) => verifyPaymentAndBook(response),
        prefill: { name: user.name, email: user.email },
        theme: { color: "#6366F1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);
        setErrorMessage(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setErrorMessage(err.response?.data?.message || "Could not initiate payment.");
    }
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!user?._id || !selectedDoctor) {
      setErrorMessage("Please log in and select a doctor.");
      setIsSubmitting(false);
      return;
    }

    if (formData.mode === "offline" && paymentOption === "payLater") {
      await bookOfflineAppointment();
    } else {
      await startPaymentFlow();
    }

    setIsSubmitting(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 text-gray-700 font-medium relative ${
      isActive ? "bg-white/50 text-indigo-600" : "hover:bg-white/30"
    }`;

  // --- JSX ---
  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex-shrink-0 flex-col shadow-2xl hidden lg:flex">
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-white/20 text-center">
          Docify<span className="text-indigo-600">+</span>
        </div>
        <div className="p-6 flex flex-col items-center border-b border-white/20">
          <img
            src={
              user?.profileImage
                ? `${API_BASE_URL}${user.profileImage}`
                : `https://ui-avatars.com/api/?name=${
                    user?.name ? user.name.replace(" ", "+") : "User"
                  }&background=818cf8&color=fff&bold=true`
            }
            alt="Patient Profile"
            className="w-24 h-24 rounded-full border-4 border-white/80 shadow-lg object-cover"
          />
          <h3 className="font-bold text-lg text-gray-800 mt-3">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/patient/dashboard" className={navLinkClass}><FiHome className="mr-3" /> Dashboard</NavLink>
          <NavLink to="/patient/my-appointments" className={navLinkClass}><FiCalendar className="mr-3" /> My Appointments</NavLink>
          <NavLink to="/patient/book-appointment" className={navLinkClass}><FiUserCheck className="mr-3" /> Find a Doctor</NavLink>
          <NavLink to="/patient/upload-report" className={navLinkClass}><FiUpload className="mr-3" /> Upload Report</NavLink>
          <NavLink to="/patient/reports" className={navLinkClass}><FiFileText className="mr-3" /> View Reports</NavLink>
          <NavLink to="/patient/subscription" className={navLinkClass}><FiStar className="mr-3" /> Subscription</NavLink>
        </nav>
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 bg-white/30 hover:bg-red-500 hover:text-white text-gray-700 font-medium"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 aurora-background overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Book an Appointment</h1>
          <p className="text-gray-600 mb-8">Schedule your next consultation in just a few clicks.</p>

          <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/30">
            {successMessage && <div className="bg-green-500/20 text-green-800 p-4 mb-6 rounded-lg border border-green-500/30">{successMessage}</div>}
            {errorMessage && <div className="bg-red-500/20 text-red-800 p-4 mb-6 rounded-lg border border-red-500/30">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor */}
              <div>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg">
                  <FiUser className="mr-3 text-indigo-500" />1. Choose a Doctor
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full bg-white/60 border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                >
                  <option value="">-- Select a Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor details */}
              {selectedDoctor && (
                <div className="p-4 bg-white/70 rounded-lg shadow border border-white/40">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Dr. {selectedDoctor.name}</h3>
                  <p className="text-gray-600 flex items-center">
                    <FiUser className="mr-2 text-indigo-500" /> Specialization: {selectedDoctor.specialization}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FiDollarSign className="mr-2 text-indigo-500" /> Fees: ₹{selectedDoctor.consultationFee}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FiMapPin className="mr-2 text-indigo-500" /> Address: {selectedDoctor.clinicLocation?.address}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className={`transition-opacity duration-500 ${formData.doctorId ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg">
                  <FiCalendar className="mr-3 text-indigo-500" />2. Select a Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className="w-full bg-white/60 border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  disabled={!formData.doctorId}
                />
              </div>

              {/* Time slots */}
              <div className={`transition-opacity duration-500 ${formData.date ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg">
                  <FiClock className="mr-3 text-indigo-500" />3. Select an Available Time
                </label>
                {loadingSlots ? (
                  <p className="text-center text-gray-600">Loading slots...</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => handleTimeSlotClick(slot)}
                          className={`p-3 rounded-lg text-center font-semibold transition-all ${
                            formData.time === slot
                              ? "bg-indigo-600 text-white shadow-lg scale-105"
                              : "bg-white/60 hover:bg-indigo-100"
                          }`}
                        >
                          {slot}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500 p-4 bg-white/40 rounded-lg">
                        No slots available for this date.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Mode */}
              <div>
                <label className="block font-semibold mb-2 text-gray-700 text-lg">4. Consultation Mode</label>
                <div className="flex bg-white/60 p-1 rounded-lg shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, mode: "offline" }))}
                    className={`w-1/2 p-2 rounded-md font-semibold flex items-center justify-center transition ${
                      formData.mode === "offline" ? "bg-white text-indigo-600 shadow" : "text-gray-600"
                    }`}
                  >
                    <FiMapPin className="mr-2" /> In-Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, mode: "online" }))}
                    className={`w-1/2 p-2 rounded-md font-semibold flex items-center justify-center transition ${
                      formData.mode === "online" ? "bg-white text-indigo-600 shadow" : "text-gray-600"
                    }`}
                  >
                    <FiVideo className="mr-2" /> Online
                  </button>
                </div>
              </div>

              {/* Payment Option */}
              {formData.mode === "offline" && (
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 text-lg">5. Payment Option</label>
                  <div className="flex bg-white/60 p-1 rounded-lg shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("payLater")}
                      className={`w-1/2 p-2 rounded-md font-semibold flex items-center justify-center transition ${
                        paymentOption === "payLater" ? "bg-white text-indigo-600 shadow" : "text-gray-600"
                      }`}
                    >
                      <FiHome className="mr-2" /> Pay at Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("payNow")}
                      className={`w-1/2 p-2 rounded-md font-semibold flex items-center justify-center transition ${
                        paymentOption === "payNow" ? "bg-white text-indigo-600 shadow" : "text-gray-600"
                      }`}
                    >
                      <FiDollarSign className="mr-2" /> Pay Now
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                disabled={!formData.time || isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : formData.mode === "online" || paymentOption === "payNow"
                  ? "Proceed to Payment"
                  : "Request Appointment"}
                <FiArrowRight className="ml-2" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
