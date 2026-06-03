import React, { useEffect, useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiArrowRight, FiSearch, FiUsers, FiCalendar, FiSettings, FiFileText, FiLogOut } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000';

// A new, redesigned card for displaying a single patient
function PatientCard({ patient, onViewDetails }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white/50 backdrop-blur-lg p-4 rounded-xl shadow-md border border-white/30 flex items-center justify-between"
        >
            <div className="flex items-center space-x-4">
                <img
                    src={patient.profileImage ? `${API_BASE_URL}${patient.profileImage}` : `https://ui-avatars.com/api/?name=${patient.name.replace(' ', '+')}&background=818cf8&color=fff`}
                    alt={patient.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-sm"
                />
                <div>
                    <p className="font-bold text-lg text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
            </div>
            <button
                onClick={() => onViewDetails(patient._id)}
                className="flex items-center bg-white/60 text-indigo-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
            >
                View Records <FiArrowRight className="ml-2" />
            </button>
        </motion.div>
    );
}

export default function MyPatients() {
    const { user, logout } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/doctors/my-patients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(res.data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Could not fetch patient list.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [user]);

    const handleViewDetails = (patientId) => {
        navigate(`/doctor/patient-details/${patientId}`);
    };

    const filteredPatients = useMemo(() => {
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Patients</h1>
                    <p className="text-gray-600 mb-8">Search for patients and access their medical records.</p>
                </motion.div>
                
                {/* Search Bar */}
                <div className="mb-6 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-lg border border-white/30 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {loading ? (
                    <p className="text-center text-gray-600 mt-10">Loading patient list...</p>
                ) : error ? (
                    <p className="text-center text-red-600 mt-10">{error}</p>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <PatientCard key={patient._id} patient={patient} onViewDetails={handleViewDetails} />
                                ))
                            ) : (
                                <div className="text-center bg-white/40 backdrop-blur-md p-12 rounded-xl shadow-md border border-white/20 mt-10">
                                    <FiUsers size={40} className="mx-auto text-indigo-400" />
                                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No Patients Found</h3>
                                    <p className="mt-1 text-gray-600">
                                        {searchTerm ? `No patients match your search for "${searchTerm}".` : "You have no recorded patients yet."}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
        </>
    );
}
