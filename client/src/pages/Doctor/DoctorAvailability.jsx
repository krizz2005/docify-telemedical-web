import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiUsers, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

// A single day's schedule component with the new toggle design
function DaySchedule({ day, index, handleScheduleChange }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 rounded-xl transition-all duration-300 border ${day.isAvailable ? 'bg-white/50 border-white/30' : 'bg-gray-500/10 border-transparent'}`}
        >
            {/* Day and Toggle Switch */}
            <div className="md:col-span-1 flex items-center justify-between">
                <label htmlFor={`available-${day.dayOfWeek}`} className="block text-md font-semibold text-gray-800">
                    {day.dayOfWeek}
                </label>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id={`available-${day.dayOfWeek}`}
                        checked={day.isAvailable}
                        onChange={(e) => handleScheduleChange(index, 'isAvailable', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {/* Start and End Time Inputs */}
            <div className={`md:col-span-3 grid grid-cols-2 gap-4 transition-opacity ${day.isAvailable ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                    <label htmlFor={`start-${day.dayOfWeek}`} className="text-sm font-medium text-gray-600">Start Time</label>
                    <input
                        type="time"
                        id={`start-${day.dayOfWeek}`}
                        value={day.startTime}
                        disabled={!day.isAvailable}
                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                        className="mt-1 block w-full rounded-lg bg-white/60 p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor={`end-${day.dayOfWeek}`} className="text-sm font-medium text-gray-600">End Time</label>
                    <input
                        type="time"
                        id={`end-${day.dayOfWeek}`}
                        value={day.endTime}
                        disabled={!day.isAvailable}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        className="mt-1 block w-full rounded-lg bg-white/60 p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function DoctorAvailability() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/availability`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const sortedSchedule = res.data.schedule.sort((a, b) => days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek));
                setSchedule(sortedSchedule);
            } catch (err) {
                console.error('Failed to fetch availability:', err);
                setStatusMessage({ type: 'error', text: 'Could not load your schedule.' });
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, [user]);

    const handleScheduleChange = (dayIndex, field, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[dayIndex][field] = value;
        setSchedule(updatedSchedule);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/availability`, { schedule }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatusMessage({ type: 'success', text: 'Availability saved successfully!' });
        } catch (err) {
            console.error('Failed to save availability:', err);
            setStatusMessage({ type: 'error', text: 'Failed to save your changes.' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
        }
    };

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
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Availability</h1>
                    <p className="text-gray-600 mb-8">Set your weekly working hours for patient appointments.</p>
                </motion.div>
                
                <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/30">
                    <div className="space-y-4">
                        <AnimatePresence>
                            {loading && schedule.length === 0 ? <p>Loading schedule...</p> : schedule.map((day, index) => (
                                <DaySchedule key={day.dayOfWeek} day={day} index={index} handleScheduleChange={handleScheduleChange} />
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-end pt-6 mt-6 border-t border-white/50">
                        {statusMessage.text && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mr-4 text-sm font-semibold flex items-center ${statusMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {statusMessage.type === 'success' ? <FiCheckCircle className="mr-2"/> : <FiAlertCircle className="mr-2"/>}
                                {statusMessage.text}
                            </motion.p>
                        )}
                        <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.form>
            </main>
        </div>
        </>
    );
}

