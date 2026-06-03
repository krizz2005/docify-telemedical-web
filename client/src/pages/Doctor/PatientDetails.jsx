import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, FiCalendar, FiFileText, FiUser, FiDownload, 
    FiUsers, FiSettings, FiLogOut, FiClock, FiVideo 
} from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

// A card for a single item in the appointment history list
function AppointmentHistoryCard({ appt }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/60 p-4 rounded-xl flex items-center justify-between"
        >
            <div className="flex flex-col">
                <p className="font-semibold text-gray-800">Consultation on {new Date(appt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-600">at {appt.time} ({appt.mode})</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                appt.status === 'confirmed' || appt.status === 'completed' ? 'bg-green-500/20 text-green-800' : 
                appt.status === 'pending' ? 'bg-amber-500/20 text-amber-800' :
                'bg-red-500/20 text-red-800'
            }`}>
                {appt.status}
            </span>
        </motion.div>
    );
}

// A card for a single item in the report history list
function ReportHistoryCard({ report }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/60 p-4 rounded-xl flex items-center justify-between"
        >
            <div className="flex items-center truncate">
                <FiFileText className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0" />
                <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">{report.title}</p>
                    <p className="text-xs text-gray-500">Uploaded on {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <a href={`${API_BASE_URL}${report.filePath}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white/80 text-indigo-600 font-semibold px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm">
                <FiDownload className="mr-2" /> View
            </a>
        </motion.div>
    );
}

export default function PatientDetails() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('appointments');

    useEffect(() => {
        if (!patientId) {
            setError('Invalid patient ID.');
            setLoading(false);
            return;
        }

        const fetchPatientDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication Error: No token found.");
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${API_BASE_URL}/api/patients/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatientData(res.data);
            } catch (err) {
                console.error('Error fetching patient details:', err);
                setError(err.response?.data?.message || "Patient not found or you don't have access.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 text-gray-700 font-medium relative ${
          isActive ? 'bg-white/50 text-indigo-600' : 'hover:bg-white/30'
        }`;

    const { patient, appointmentHistory, reportHistory } = patientData || {};

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
            @keyframes aurora { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        `}</style>
        <div className="flex min-h-screen font-sans">
            <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex-shrink-0 flex-col shadow-2xl hidden lg:flex">
                <div className="p-6 text-2xl font-bold text-gray-800 border-b border-white/20 text-center">Docify<span className="text-indigo-600">+</span></div>
                <div className="p-6 flex flex-col items-center border-b border-white/20">
                    <img src={user?.profileImage ? `${API_BASE_URL}${user.profileImage}` : `https://ui-avatars.com/api/?name=Dr+${user?.name.replace(' ', '+')}&background=818cf8&color=fff&bold=true`} alt="Doctor Profile" className="w-24 h-24 rounded-full border-4 border-white/80 shadow-lg object-cover" />
                    <h3 className="font-bold text-lg text-gray-800 mt-3">Dr. {user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.specialization}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/doctor/dashboard" className={navLinkClass}><FiUsers className="mr-3" /> Dashboard</NavLink>
                    <NavLink to="/doctor/appointments" className={navLinkClass}><FiCalendar className="mr-3" /> Appointments</NavLink>
                    <NavLink to="/doctor/availability" className={navLinkClass}><FiSettings className="mr-3" /> Availability</NavLink>
                    <NavLink to="/doctor/my-patients" className={navLinkClass}><FiUsers className="mr-3" /> My Patients</NavLink>
                    <NavLink to="/doctor/reports" className={navLinkClass}><FiFileText className="mr-3" /> View Reports</NavLink>
                </nav>
                <div className="p-4 border-t border-white/20">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg transition-all duration-200 bg-white/30 hover:bg-red-500 hover:text-white text-gray-700 font-medium"><FiLogOut className="mr-3" /> Logout</button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-8 aurora-background overflow-y-auto">
                {loading ? (
                    <p className="text-center text-gray-600 mt-10">Loading patient details...</p>
                ) : error ? (
                    <p className="text-center text-red-600 mt-10">{error}</p>
                ) : !patient ? (
                    <p className="text-center text-gray-600 mt-10">Patient data could not be loaded.</p>
                ) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="mb-6">
                                <Link to="/doctor/my-patients" className="inline-flex items-center text-indigo-700 hover:underline font-semibold">
                                    <FiArrowLeft className="mr-2" /> Back to Patient List
                                </Link>
                            </div>
                            <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 flex items-center space-x-6 mb-8">
                                <img src={patient.profileImage ? `${API_BASE_URL}${patient.profileImage}` : `https://ui-avatars.com/api/?name=${patient.name.replace(' ', '+')}&background=818cf8&color=fff`} alt="Patient" className="w-24 h-24 rounded-full border-4 border-white/80 shadow-md object-cover" />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                                    <p className="text-gray-600">{patient.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">Patient ID: {patient._id}</p>
                                </div>
                            </div>
                        </motion.div>
                        
                        <div className="mb-6 bg-white/40 backdrop-blur-md p-1.5 rounded-xl inline-flex space-x-2 border border-white/30">
                            <button onClick={() => setActiveTab('appointments')} className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${activeTab === 'appointments' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-white/50'}`}>
                                Appointment History
                            </button>
                            <button onClick={() => setActiveTab('reports')} className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${activeTab === 'reports' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-white/50'}`}>
                                Medical Reports
                            </button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'appointments' && (
                                    appointmentHistory?.length > 0 ? (
                                        <div className="space-y-3">
                                            {appointmentHistory.map(app => <AppointmentHistoryCard key={app._id} appt={app} />)}
                                        </div>
                                    ) : (
                                        <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20"><p>No appointment history found.</p></div>
                                    )
                                )}
                                {activeTab === 'reports' && (
                                    reportHistory?.length > 0 ? (
                                        <div className="space-y-3">
                                            {reportHistory.map(report => <ReportHistoryCard key={report._id} report={report} />)}
                                        </div>
                                    ) : (
                                        <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20"><p>No reports have been uploaded for this patient.</p></div>
                                    )
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </main>
        </div>
        </>
    );
}
