// File: client/src/pages/Patient/MyAppointments.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar, FiClock, FiVideo, FiCheckCircle, FiAlertTriangle,
  FiXCircle, FiHome, FiUserCheck, FiUpload, FiFileText, FiLogOut, FiCreditCard
} from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

// ------------------ Appointment Card ------------------
function AppointmentCard({ appt }) {
  const getStatusInfo = (status, date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(date);

    if (apptDate < today && status === 'confirmed') {
      return { icon: <FiCheckCircle />, text: 'Completed', style: 'text-gray-600 bg-gray-500/10' };
    }
    switch (status) {
      case 'confirmed':
        return { icon: <FiCheckCircle />, text: 'Confirmed', style: 'text-green-600 bg-green-500/10' };
      case 'pending':
        return { icon: <FiAlertTriangle />, text: 'Pending', style: 'text-amber-600 bg-amber-500/10' };
      case 'rejected':
      case 'cancelled':
        return { icon: <FiXCircle />, text: 'Cancelled', style: 'text-red-600 bg-red-500/10' };
      default:
        return { icon: <FiClock />, text: status, style: 'text-gray-600 bg-gray-500/10' };
    }
  };

  const statusInfo = getStatusInfo(appt.status, appt.date);

  // Payment status colors
  const paymentClass =
    appt.paymentStatus === 'paid'
      ? 'text-green-700 bg-green-500/20 border-green-500/30'
      : 'text-red-700 bg-red-500/20 border-red-500/30';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow-md border border-white/30"
    >
      {/* Doctor Info + Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex items-center space-x-4">
          <img
            src={
              appt.doctorId?.profileImage
                ? `${API_BASE_URL}${appt.doctorId.profileImage}`
                : `https://ui-avatars.com/api/?name=${appt.doctorId?.name?.replace(' ', '+')}&background=818cf8&color=fff`
            }
            alt="Doctor"
            className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-sm"
          />
          <div>
            <p className="font-bold text-xl text-gray-900">Dr. {appt.doctorId?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{appt.doctorId?.specialization || 'General'}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 sm:mt-0">
          <div className={`flex items-center px-3 py-1.5 text-sm font-semibold rounded-full h-fit ${statusInfo.style}`}>
            {statusInfo.icon}
            <span className="ml-2 capitalize">{statusInfo.text}</span>
          </div>
          <div className={`px-3 py-1.5 text-sm font-semibold rounded-full h-fit border flex items-center ${paymentClass}`}>
            <FiCreditCard className="mr-1" />
            {appt.paymentStatus === 'paid' ? 'paid' : 'Unpaid'}
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="border-t border-white/50 my-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
        <div className="flex items-center bg-white/40 p-2 rounded-lg">
          <FiCalendar className="mr-3 text-indigo-500" />
          <span>{new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center bg-white/40 p-2 rounded-lg">
          <FiClock className="mr-3 text-indigo-500" />
          <span>{appt.time}</span>
        </div>
        <div className="flex items-center bg-white/40 p-2 rounded-lg">
          <FiVideo className="mr-3 text-indigo-500" />
          <span className="capitalize">{appt.mode}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------ MyAppointments Page ------------------
export default function MyAppointments() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }

    const fetchAppointments = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE_URL}/api/appointments/patient/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Could not load your appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, location, navigate]);

  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return appointments.filter(app =>
        new Date(app.date) >= today && ['confirmed', 'pending'].includes(app.status)
      );
    }
    if (activeTab === 'past') {
      return appointments.filter(app =>
        new Date(app.date) < today || ['cancelled', 'rejected'].includes(app.status)
      );
    }
    return appointments;
  }, [appointments, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex-shrink-0 flex-col shadow-2xl hidden lg:flex">
        <nav className="flex-1 p-6 space-y-2">
          <NavLink to="/patient/dashboard" className="flex items-center space-x-2 py-2.5 px-4 rounded-lg hover:bg-white/30">
            <FiHome /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/patient/my-appointments" className="flex items-center space-x-2 py-2.5 px-4 rounded-lg bg-white/50 text-indigo-600">
            <FiCalendar /> <span>My Appointments</span>
          </NavLink>
          <NavLink to="/patient/reports" className="flex items-center space-x-2 py-2.5 px-4 rounded-lg hover:bg-white/30">
            <FiFileText /> <span>My Reports</span>
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 m-6 py-2 px-4 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 aurora-background overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600 mb-8">Review your upcoming visits and past consultation history.</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-green-500/20 text-green-800 p-4 mb-6 rounded-lg border border-green-500/30 flex items-center justify-between"
            >
              <div className="flex items-center">
                <FiCheckCircle className="mr-3" />
                <span>{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage('')} className="text-green-800 hover:text-green-900">
                <FiXCircle />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="mb-6 bg-white/40 backdrop-blur-md p-1.5 rounded-xl inline-flex space-x-2 border border-white/30">
          {['upcoming', 'past', 'all'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
                activeTab === tab ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointment List */}
        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading your appointments...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-10">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20 mt-10">
            <FiCalendar size={40} className="mx-auto text-indigo-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No {activeTab} appointments</h3>
            <p className="mt-1 text-gray-600">You can book a new one from the 'Find a Doctor' page.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredAppointments.map(appt => (
                <AppointmentCard key={appt._id} appt={appt} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
