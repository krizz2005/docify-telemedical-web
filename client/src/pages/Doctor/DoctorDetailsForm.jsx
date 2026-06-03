import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:5000';

export default function DoctorDetailsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId; // Get userId passed from registration page

    const [formData, setFormData] = useState({
        specialization: '',
        qualifications: '',
        clinicAddress: '',
    });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    
    if (!userId) {
       return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                     <h2 className="text-2xl font-bold text-red-600">Error</h2>
                     <p className="text-gray-700 mt-2">No user ID found. Please register first.</p>
                </div>
            </div>
       );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', type: '' });
        try {
            await axios.post(`${API_BASE_URL}/api/admin/submit-doctor-details`, { ...formData, userId });
            setStatus({ message: 'Your details have been submitted for review. You will be notified upon approval.', type: 'success' });
             setTimeout(() => navigate('/login'), 4000); // Redirect to login after a delay
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Submission failed. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-2">Please provide these additional details for verification.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input type="text" name="specialization" id="specialization" required onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications (e.g., MBBS, MD)</label>
                        <input type="text" name="qualifications" id="qualifications" required onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700">Clinic Address</label>
                        <textarea name="clinicAddress" id="clinicAddress" rows="3" required onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    
                    {status.message && (
                        <p className={`text-center font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {status.message}
                        </p>
                    )}

                    <div>
                        <button type="submit" disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
