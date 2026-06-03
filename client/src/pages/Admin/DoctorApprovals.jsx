import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

export default function DoctorApprovals() {
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPendingDoctors = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE_URL}/api/admin/pending-doctors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPendingDoctors(data);
        } catch (err) {
            setError('Failed to fetch pending doctors.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const handleUpdateStatus = async (doctorId, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/api/admin/update-doctor-status`, 
                { doctorId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh list after update
            setPendingDoctors(prev => prev.filter(doc => doc._id !== doctorId));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Doctor Approvals</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="space-y-4">
                {pendingDoctors.length > 0 ? (
                    pendingDoctors.map(doctor => (
                        <motion.div
                            key={doctor._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">{doctor.name}</p>
                                <p className="text-sm text-gray-600">{doctor.email}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {doctor.specialization} - {doctor.qualifications} <br/>
                                    {doctor.clinicAddress}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdateStatus(doctor._id, 'active')}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Approve
                                </button>
                                <button onClick={() => handleUpdateStatus(doctor._id, 'rejected')}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    !loading && <p className="text-gray-500">No doctors are currently pending approval.</p>
                )}
            </div>
        </div>
    );
}
