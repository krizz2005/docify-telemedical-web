// File: client/src/pages/Doctor/DoctorAppointments.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiCalendar, FiClock, FiVideo, FiCheck, FiX, 
    FiUsers, FiFileText, FiSettings, FiLogOut, FiCreditCard
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000';

// -------- Appointment Card for Doctor --------
function AppointmentCard({ appt, onUpdateStatus, onStartCall }) {
    const statusInfo = {
        confirmed: { text: 'Confirmed', style: 'text-sky-800 bg-sky-500/20 border-sky-500/30' },
        pending: { text: 'Pending', style: 'text-amber-800 bg-amber-500/20 border-amber-500/30' },
        rejected: { text: 'Rejected', style: 'text-red-800 bg-red-500/20 border-red-500/30' },
        completed: { text: 'Completed', style: 'text-emerald-800 bg-emerald-500/20 border-emerald-500/30' }
    };
    const currentStatus = statusInfo[appt.status] || { text: appt.status, style: 'text-gray-800 bg-gray-500/20 border-gray-500/30' };

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
            <div className="flex flex-col sm:flex-row justify-between items-start">
                {/* Patient Info */}
                <div className="flex items-center space-x-4">
                    <img
                        src={appt.patientId?.profileImage 
                            ? `${API_BASE_URL}${appt.patientId.profileImage}` 
                            : `https://ui-avatars.com/api/?name=${appt.patientId?.name.replace(' ', '+')}&background=818cf8&color=fff`}
                        alt="Patient"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-sm"
                    />
                    <div>
                        <p className="font-bold text-xl text-gray-900">{appt.patientId?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{appt.patientId?.email || ''}</p>
                    </div>
                </div>
                {/* Appointment Status */}
                <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                    <div className={`px-3 py-1.5 text-sm font-semibold rounded-full h-fit border ${currentStatus.style}`}>
                        <span className="capitalize">{currentStatus.text}</span>
                    </div>
                    <div className={`px-3 py-1.5 text-sm font-semibold rounded-full h-fit border flex items-center ${paymentClass}`}>
                        <FiCreditCard className="mr-1" />
                        {appt.paymentStatus === 'paid' ? 'paid' : 'Unpaid'}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/50 my-4"></div>

            {/* Appointment Info + Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-gray-700">
                    <div className="flex items-center"><FiCalendar className="mr-2 text-indigo-500" /><span>{new Date(appt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                    <div className="flex items-center"><FiClock className="mr-2 text-indigo-500" /><span>{appt.time}</span></div>
                    <div className="flex items-center"><FiVideo className="mr-2 text-indigo-500" /><span className="capitalize">{appt.mode}</span></div>
                </div>
                <div className="flex items-center space-x-2">
                    {appt.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => onUpdateStatus(appt._id, 'confirmed')} 
                                className="p-2 rounded-full hover:bg-green-500/20 text-green-600 transition-colors" 
                                title="Accept"
                            >
                                <FiCheck size={20} />
                            </button>
                            <button 
                                onClick={() => onUpdateStatus(appt._id, 'rejected')} 
                                className="p-2 rounded-full hover:bg-red-500/20 text-red-600 transition-colors" 
                                title="Reject"
                            >
                                <FiX size={20} />
                            </button>
                        </>
                    )}
                    {appt.mode === 'online' && appt.status === 'confirmed' && (
                        <button 
                            onClick={() => onStartCall(appt._id)} 
                            className="flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            title="Start Video Call"
                        >
                            <FiVideo size={16} className="mr-2" /> Start Call
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// -------- Main Page --------
export default function DoctorAppointments() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); 

    const fetchAppointments = useCallback(async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/doctors/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/api/appointments/update-status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAppointments();
        } catch (err) {
            console.error(err);
            setError('Failed to update status.');
        }
    };

    const handleVideoCall = (appointmentId) => navigate(`/video-call/${appointmentId}`);

    const filteredAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let sorted = [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

        if (activeTab === 'pending') return sorted.filter(app => app.status === 'pending');
        if (activeTab === 'upcoming') return sorted.filter(app => new Date(app.date) >= today && app.status === 'confirmed');
        if (activeTab === 'completed') return sorted.filter(app => new Date(app.date) < today || ['rejected', 'cancelled', 'completed'].includes(app.status));
        return sorted; // all
    }, [appointments, activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 text-gray-700 font-medium relative ${
          isActive ? 'bg-white/50 text-indigo-600' : 'hover:bg-white/30'
        }`;

    return (
        <>
        <style>{`
            .aurora-background {
                background: radial-gradient(47.19% 47.19% at 50% 50%, rgba(232, 237, 255, 0.8) 0%, rgba(232, 237, 255, 0) 100%),
                            radial-gradient(43.19% 43.19% at 66.38% 70.47%, #d6e1ff 0%, rgba(255, 222, 239, 0) 100%),
                            radial-gradient(46.3% 46.3% at 29.53% 62.65%, #d1fff8 0%, rgba(244, 222, 255, 0) 100%);
                background-size: 200% 200%;
                animation: aurora 15s ease infinite;
            }
            @keyframes aurora { 
                0% { background-position: 0% 50%; } 
                50% { background-position: 100% 50%; } 
                100% { background-position: 0% 50%; } 
            }
        `}</style>

        <div className="flex min-h-screen font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex-shrink-0 flex-col shadow-2xl hidden lg:flex">
                <div className="p-6 text-2xl font-bold text-gray-800 border-b border-white/20 text-center">
                    Docify<span className="text-indigo-600">+</span>
                </div>
                <div className="p-6 flex flex-col items-center border-b border-white/20">
                    <img 
                        src={user?.profileImage 
                            ? `${API_BASE_URL}${user.profileImage}` 
                            : `https://ui-avatars.com/api/?name=Dr+${user?.name.replace(' ', '+')}&background=818cf8&color=fff&bold=true`} 
                        alt="Doctor Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white/80 shadow-lg object-cover" 
                    />
                    <h3 className="font-bold text-lg text-gray-800 mt-3">Dr. {user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.specialization}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/doctor/dashboard" className={navLinkClass}><FiUsers className="mr-3" /> Dashboard</NavLink>
                    <NavLink to="/doctor/appointments" className={navLinkClass}><FiCalendar className="mr-3" /> Appointments</NavLink>
                    <NavLink to="/doctor/availability" className={navLinkClass}><FiSettings className="mr-3" /> Availability</NavLink>
                    <NavLink to="/doctor/my-patients" className={navLinkClass}><FiUsers className="mr-3" /> My Patients</NavLink>
                    <NavLink to="/doctor/reports" className={navLinkClass}><FiFileText className="mr-3" /> Reports</NavLink>
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

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 aurora-background overflow-y-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Appointments</h1>
                    <p className="text-gray-600 mb-8">Manage your patient consultations and schedule.</p>
                </motion.div>

                {/* Tabs */}
                <div className="mb-6 bg-white/40 backdrop-blur-md p-1.5 rounded-xl inline-flex space-x-2 border border-white/30">
                    {['pending', 'upcoming', 'completed', 'all'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Appointments List */}
                {loading ? (
                    <p className="text-center text-gray-600 mt-10">Loading appointments...</p>
                ) : error ? (
                    <p className="text-center text-red-600 mt-10">{error}</p>
                ) : filteredAppointments.length === 0 ? (
                    <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20 mt-10">
                        <FiCalendar size={40} className="mx-auto text-indigo-400" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-800">No {activeTab} appointments</h3>
                        <p className="mt-1 text-gray-600">This section is currently empty.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredAppointments.map((appt) => (
                                <AppointmentCard 
                                    key={appt._id} 
                                    appt={appt} 
                                    onUpdateStatus={updateStatus} 
                                    onStartCall={handleVideoCall} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
        </>
    );
}
