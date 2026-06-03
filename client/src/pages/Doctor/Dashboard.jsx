import React, { useEffect, useState, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

// --- SVG Icons (self-contained) ---
const FiCalendar = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiUsers = ({ className, size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const FiFileText = ({ className, size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const FiVideo = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
const FiEdit2 = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const FiLogOut = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const FiSettings = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const FiCheck = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const FiX = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FiPlus = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const FiArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const FiClock = ({ className, size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const FiSun = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const FiSunset = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>;
const FiMoon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;

// --- Components ---

function StatCard({ title, value, icon, subtitle }) {
    return (
        <motion.div
            className="bg-white/40 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20 flex items-center space-x-4 transition-all duration-300 hover:bg-white/60 hover:shadow-xl hover:-translate-y-1"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-600 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </motion.div>
    );
}

function AppointmentItem({ app, onUpdateStatus, onStartCall }) {
    const statusInfo = {
        confirmed: { text: 'Confirmed', style: 'text-sky-800 bg-sky-500/20' },
        pending: { text: 'Pending', style: 'text-amber-800 bg-amber-500/20' },
        rejected: { text: 'Rejected', style: 'text-red-800 bg-red-500/20' },
        completed: { text: 'Completed', style: 'text-emerald-800 bg-emerald-500/20' }
    };
    const currentStatus = statusInfo[app.status] || { text: app.status, style: 'text-gray-800 bg-gray-500/20' };
    
    let dateStr = "Unknown date";
    try {
        if (app.date) {
            dateStr = new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    } catch {
        dateStr = "Invalid date";
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-white/50 backdrop-blur-lg p-4 rounded-xl shadow-md border border-white/30"
        >
            <div className="flex items-center space-x-4">
                <img 
                    src={app.patientId?.profileImage ? `${API_BASE_URL}${app.patientId.profileImage}` : `https://ui-avatars.com/api/?name=${app.patientId?.name?.replace(' ', '+')}&background=818cf8&color=fff&bold=true`}
                    alt={app.patientId?.name || "Patient"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/80 shadow-sm"
                />
                <div>
                    <Link to={`/doctor/patient-details/${app.patientId?._id}`} className="font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                        {app.patientId?.name || "Unknown Patient"}
                    </Link>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FiClock className="mr-1.5" size={14} />
                        <span>{dateStr} at {app.time || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${currentStatus.style}`}>
                    {currentStatus.text}
                </span>

                <div className="flex items-center space-x-2">
                    {app.status === 'pending' && (
                        <>
                            <button onClick={() => onUpdateStatus(app._id, 'confirmed')} className="p-2 rounded-full hover:bg-green-500/20 text-green-600 transition-colors" title="Accept">
                                <FiCheck size={18} />
                            </button>
                            <button onClick={() => onUpdateStatus(app._id, 'rejected')} className="p-2 rounded-full hover:bg-red-500/20 text-red-600 transition-colors" title="Reject">
                                <FiX size={18} />
                            </button>
                        </>
                    )}
                    {app.mode === 'online' && app.status === 'confirmed' && (
                        <button onClick={() => onStartCall(app._id)} className="flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5" title="Start Video Call">
                            <FiVideo size={16} className="mr-2" /> Start Call
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <FiSun className="mr-3" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <FiSunset className="mr-3" /> };
    return { text: "Good Evening", icon: <FiMoon className="mr-3" /> };
};

function ProfileEditModal({ user, onSave, onClose, updateUser }) {
    const [formData, setFormData] = useState({
        specialization: user.specialization || '',
        qualifications: user.qualifications || '',
        consultationFee: user.consultationFee || '',
        clinicAddress: user.clinicLocation?.address || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const updatedData = {
                specialization: formData.specialization,
                qualifications: formData.qualifications,
                consultationFee: Number(formData.consultationFee),
                clinicLocation: { address: formData.clinicAddress },
            };
            const { data } = await axios.put(`${API_BASE_URL}/api/doctors/profile`, updatedData, {
                 headers: { Authorization: `Bearer ${token}` },
            });
            updateUser(data); // Update context
            onSave(); // Close modal and potentially refresh dashboard data
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white/80 backdrop-blur-xl w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-white/30"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                     <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="Qualifications (e.g., MBBS, MD)" className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                     <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="Consultation Fee (INR)" className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                     <textarea name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} placeholder="Clinic Address" rows="3" className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}


export default function DoctorDashboard() {
    const { user, updateUser, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ totalPatients: 0, newReports: 0 });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const greeting = getGreeting();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user?._id) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { headers: { Authorization: `Bearer ${token}` } };
            
            const [appointmentsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/doctors/appointments`, headers),
                axios.get(`${API_BASE_URL}/api/doctors/stats`, headers)
            ]);

            const sortedAppointments = appointmentsRes.data.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(a.date || 0) - new Date(b.date || 0);
            });
            setAppointments(sortedAppointments);
            setStats(statsRes.data);

        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !user?._id) return;
        const formData = new FormData();
        formData.append('profileImage', file);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/doctors/upload-profile-image/${user._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            updateUser({ profileImage: res.data.imageUrl });
        } catch (err) {
            console.error('Failed to upload profile image:', err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/api/appointments/update-status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleVideoCall = (appointmentId) => navigate(`/video-call/${appointmentId}`);

    const getTodayAppointmentsCount = () => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(app => {
            if (!app.date) return false;
            const appDate = new Date(app.date).toISOString().split('T')[0];
            return appDate === today && app.status === 'confirmed';
        }).length;
    };

    const getPendingAppointmentsCount = () =>
        appointments.filter(app => app.status === 'pending').length;

    const navLinkClass = ({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 text-gray-700 font-medium relative ${
            isActive ? 'bg-white/50 text-indigo-600' : 'hover:bg-white/30'
        }`;

    return (
        <>
            <AnimatePresence>
                {isProfileModalOpen && (
                    <ProfileEditModal 
                        user={user} 
                        onClose={() => setIsProfileModalOpen(false)}
                        onSave={() => {
                            setIsProfileModalOpen(false);
                            fetchData();
                        }}
                        updateUser={updateUser}
                    />
                )}
            </AnimatePresence>
            
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
                <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex-shrink-0 flex-col shadow-2xl hidden lg:flex">
                    <div className="p-6 text-2xl font-bold text-gray-800 border-b border-white/20 text-center">
                        Docify<span className="text-indigo-600">+</span>
                    </div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20">
                        <div className="relative group mb-3" onClick={() => fileInputRef.current.click()}>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg" />
                            <img 
                                src={user?.profileImage ? `${API_BASE_URL}${user.profileImage}` : `https://ui-avatars.com/api/?name=Dr+${user?.name?.replace(' ', '+')}&background=818cf8&color=fff&bold=true`} 
                                alt="Doctor Profile" 
                                className="w-24 h-24 rounded-full border-4 border-white/80 shadow-lg object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                <FiEdit2 size={24} />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">Dr. {user?.name}</h3>
                        <p className="text-sm text-gray-500">{user?.specialization || 'Not set'}</p>
                        
                        <button 
                            onClick={() => setIsProfileModalOpen(true)}
                            className="mt-3 text-xs font-semibold text-indigo-600 bg-indigo-100/50 hover:bg-indigo-200/50 px-3 py-1 rounded-full transition"
                        >
                            Edit Profile
                        </button>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <NavLink to="/doctor/dashboard" className={navLinkClass}><FiUsers className="mr-3" /> Dashboard</NavLink>
                        <NavLink to="/doctor/appointments" className={navLinkClass}><FiCalendar className="mr-3" /> Appointments</NavLink>
                        <NavLink to="/doctor/availability" className={navLinkClass}><FiSettings className="mr-3" /> Availability</NavLink>
                        <NavLink to="/doctor/my-patients" className={navLinkClass}><FiUsers className="mr-3" /> My Patients</NavLink>
                        <NavLink to="/doctor/reports" className={navLinkClass}><FiFileText className="mr-3" /> View Reports</NavLink>
                    </nav>
                    <div className="p-4 border-t border-white/20">
                        <button onClick={logout} className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 bg-white/30 hover:bg-red-500 hover:text-white text-gray-700 font-medium">
                            <FiLogOut className="mr-3" /> Logout
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-8 aurora-background">
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="flex items-center text-3xl font-bold text-gray-800">
                                {greeting.icon} {greeting.text}, Dr. {user?.name?.split(' ')[0]}!
                            </h1>
                            <p className="text-md text-gray-600 mt-1">Here is a summary of your activities.</p>
                        </div>
                        <Link to="/doctor/availability" className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                            <FiPlus size={20} className="mr-2" /> Set Availability
                        </Link>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        <StatCard title="Appointments Today" value={getTodayAppointmentsCount()} icon={<FiCalendar size={24} />} subtitle="Confirmed for today" />
                        <StatCard title="Pending Requests" value={getPendingAppointmentsCount()} icon={<FiClock size={24} />} subtitle="Require your approval" />
                        <StatCard title="Total Patients" value={stats.totalPatients} icon={<FiUsers size={24} />} subtitle="Under your care" />
                        <StatCard title="New Reports" value={stats.newReports} icon={<FiFileText size={24} />} subtitle="Ready for review" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Priority Queue</h2>
                            <Link to="/doctor/appointments" className="flex items-center text-sm font-semibold text-indigo-700 hover:underline">
                                View All <FiArrowRight className="ml-1" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {appointments.length > 0 ? (
                                    appointments.slice(0, 5).map((app) => (
                                        <AppointmentItem key={app._id} app={app} onUpdateStatus={updateStatus} onStartCall={handleVideoCall} />
                                    ))
                                ) : (
                                    <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20">
                                        <FiCalendar size={48} className="mx-auto text-indigo-400" />
                                        <h3 className="mt-4 text-xl font-semibold text-gray-800">No Pending Appointments</h3>
                                        <p className="mt-1 text-gray-600">Your schedule is clear. All patient requests have been handled.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
}

