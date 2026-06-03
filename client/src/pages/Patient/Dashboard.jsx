import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    FiLogOut, FiHome, FiCalendar, FiUserCheck, FiUpload, 
    FiFileText, FiStar, FiArrowRight, FiVideo, FiClock, FiPlus, FiSun, FiMoon, FiSunset
} from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

// A reusable, glassmorphism-style card for dashboard navigation
function DashboardCard({ icon, title, description, to }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link to={to} className="block bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 h-full transition-all duration-300 hover:bg-white/60 hover:shadow-xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md mb-4 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                <div className="flex items-center text-sm font-semibold text-indigo-700 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <FiArrowRight className="ml-1.5" />
                </div>
            </Link>
        </motion.div>
    );
}

// Redesigned card for a single upcoming appointment
function UpcomingAppointmentCard({ appointment, onJoinCall }) {
    return (
        <motion.div 
            className="bg-white/50 backdrop-blur-lg p-4 rounded-xl shadow-md flex items-center justify-between border border-white/30 hover:bg-white/70 transition-colors"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <div className="flex items-center space-x-4">
                <img 
                    src={appointment.doctorId?.profileImage ? `${API_BASE_URL}${appointment.doctorId.profileImage}` : `https://ui-avatars.com/api/?name=${appointment.doctorId?.name.replace(' ', '+')}&background=818cf8&color=fff`} 
                    alt="Doctor" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/80 shadow-sm" 
                />
                <div>
                    <p className="font-bold text-gray-900">Dr. {appointment.doctorId?.name}</p>
                    <p className="text-sm text-gray-600">{appointment.doctorId?.specialization}</p>
                </div>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-700 bg-white/50 px-3 py-1.5 rounded-lg">
                <FiClock className="mr-2 text-indigo-600" />
                {new Date(appointment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {appointment.time}
            </div>
            {appointment.mode === 'online' && (
                <button 
                    onClick={() => onJoinCall(appointment._id)} 
                    className="flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <FiVideo className="mr-2" /> Join Call
                </button>
            )}
        </motion.div>
    );
}

// Function to get a time-based greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <FiSun className="mr-3" /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <FiSunset className="mr-3" /> };
    return { text: "Good Evening", icon: <FiMoon className="mr-3" /> };
};


export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const greeting = getGreeting();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?._id) return;
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/appointments/patient/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureAppointments = res.data
                    .filter(app => new Date(app.date) >= today && app.status === 'confirmed')
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setUpcomingAppointments(futureAppointments);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
                setError('Could not load your upcoming appointments.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleJoinCall = (appointmentId) => {
        navigate(`/video-call/${appointmentId}`);
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
                            radial-gradient(46.3% 46.3% at 29.53% 62.65%, #d1fff8 0%, rgba(244, 222, 255, 0) 100%),
                            radial-gradient(45.6% 45.6% at 50.05% 29.79%, #ffd4d4 0%, rgba(212, 225, 255, 0) 100%),
                            radial-gradient(47.19% 47.19% at 27.81% 23.44%, #d1faff 0%, rgba(232, 237, 255, 0) 100%),
                            radial-gradient(45.6% 45.6% at 72.34% 23.44%, #f8d4ff 0%, rgba(212, 225, 255, 0) 100%);
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
            <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-2xl">
                <div className="p-6 text-2xl font-bold text-gray-800 border-b border-white/20 text-center">
                    Docify<span className="text-indigo-600">+</span>
                </div>
                <div className="p-6 flex flex-col items-center border-b border-white/20">
                    <img
                        src={user?.profileImage ? `${API_BASE_URL}${user.profileImage}` : `https://ui-avatars.com/api/?name=${user?.name.replace(' ', '+')}&background=818cf8&color=fff&bold=true`}
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
                    <button onClick={handleLogout} className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 bg-white/30 hover:bg-red-500 hover:text-white text-gray-700 font-medium">
                        <FiLogOut className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 aurora-background">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="flex items-center text-3xl font-bold text-gray-800">{greeting.icon} {greeting.text}, {user?.name.split(' ')[0]}!</h1>
                        <p className="text-md text-gray-600 mt-1">Here's your health summary for today.</p>
                    </div>
                    <Link to="/patient/book-appointment" className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                        <FiPlus size={20} className="mr-2" /> Book New Appointment
                    </Link>
                </motion.div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Upcoming Appointments</h2>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading appointments...</p>
                    ) : error ? (
                        <div className="text-center bg-red-100/50 backdrop-blur-sm text-red-700 p-4 rounded-lg border border-red-200">{error}</div>
                    ) : upcomingAppointments.length > 0 ? (
                        <motion.div className="space-y-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                            {upcomingAppointments.map(app => (
                                <UpcomingAppointmentCard key={app._id} appointment={app} onJoinCall={handleJoinCall} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-md border border-white/20">
                            <FiCalendar size={36} className="mx-auto text-indigo-400" />
                            <h3 className="mt-3 text-lg font-semibold text-gray-800">No upcoming appointments</h3>
                            <p className="mt-1 text-gray-600">Your confirmed future appointments will appear here.</p>
                        </div>
                    )}
                </div>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}>
                    <DashboardCard to="/patient/my-appointments" title="All Appointments" description="View your complete appointment history." icon={<FiCalendar size={20} />} />
                    <DashboardCard to="/patient/reports" title="Medical Reports" description="Access all your uploaded documents." icon={<FiFileText size={20} />} />
                    <DashboardCard to="/patient/upload-report" title="Upload Document" description="Add a new medical report or lab result." icon={<FiUpload size={20} />} />
                    <DashboardCard to="/patient/subscription" title="My Subscription" description="Manage your current plan and benefits." icon={<FiStar size={20} />} />
                    <DashboardCard to="/patient/stored-files" title="stored Reports" description="Stored and dowlaod the reports." icon={<FiStar size={20} />} />
                
                </motion.div>
            </main>
        </div>
        </>
    );
}

