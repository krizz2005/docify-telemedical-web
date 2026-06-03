import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    FiUploadCloud, FiFileText, FiXCircle, FiUser, FiEdit3, FiArrowRight, 
    FiHome, FiCalendar, FiUserCheck, FiUpload, FiStar, FiLogOut, FiSettings, FiUsers
} from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

export default function UploadReport() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    // Fetch the doctor's list of patients to populate the dropdown
    useEffect(() => {
        const fetchPatients = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                // This endpoint should return a list of the doctor's patients
                const res = await axios.get(`${API_BASE_URL}/api/doctors/my-patients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(res.data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setStatus({ message: 'Could not load your patient list.', type: 'error' });
            }
        };
        fetchPatients();
    }, [user]);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus({ message: '', type: '' });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'image/jpeg': [], 'image/png': [] },
        multiple: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selectedPatient || !title) {
            setStatus({ message: 'Please select a patient, provide a title, and choose a file.', type: 'error' });
            return;
        }
        setLoading(true);
        setStatus({ message: '', type: '' });

        const formData = new FormData();
        formData.append('patientId', selectedPatient);
        formData.append('doctorId', user._id); // The logged-in doctor is the one uploading
        formData.append('title', title);
        formData.append('reportFile', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/reports`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatus({ message: 'Report uploaded successfully!', type: 'success' });
            setSelectedPatient('');
            setTitle('');
            setFile(null);
        } catch (err) {
            console.error('Upload error:', err);
            setStatus({ message: 'Upload failed. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Upload Patient Report</h1>
                    <p className="text-gray-600 mb-8">Attach a new medical document to a patient's record.</p>

                    <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/30">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg"><FiUser className="mr-3 text-indigo-500"/>1. Select Patient</label>
                                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="w-full bg-white/60 border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required>
                                    <option value="">-- Choose a patient --</option>
                                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg"><FiEdit3 className="mr-3 text-indigo-500"/>2. Report Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Blood Test Results - Sep 2025" className="w-full bg-white/60 border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-700 flex items-center text-lg"><FiUploadCloud className="mr-3 text-indigo-500"/>3. Upload File</label>
                                <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-300'}`}>
                                    <input {...getInputProps()} />
                                    <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-3" />
                                    <p>Drag & drop a file here, or click to select</p>
                                </div>
                            </div>

                            {file && (
                                <div className="p-3 bg-white/60 rounded-lg flex items-center justify-between border border-white/50">
                                    <div className="flex items-center truncate"><FiFileText className="mr-3 text-indigo-600 flex-shrink-0" /><span className="truncate">{file.name}</span></div>
                                    <button onClick={() => setFile(null)} type="button" className="p-1 text-gray-500 hover:text-red-500"><FiXCircle /></button>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg" disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload Report'}
                                <FiArrowRight className="ml-2"/>
                            </button>
                            
                            {status.message && (
                                <p className={`text-center mt-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-800' : 'bg-red-500/20 text-red-800'}`}>
                                    {status.message}
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
        </>
    );
}

