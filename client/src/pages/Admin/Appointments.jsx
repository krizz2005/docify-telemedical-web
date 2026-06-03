// client/src/pages/Admin/ManageDoctors.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiBriefcase, FiMapPin, FiSave, FiX, FiEdit, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa"; // Using a more specific icon for Rupee
import Layout from "../../components/Layout";
import { getAllDoctors, updateDoctor } from "../../services/adminService";

// --- Reusable Sub-Components ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md">
        <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Doctors Found</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
);

const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-5 right-5 flex items-center gap-4 p-4 rounded-lg shadow-2xl text-white ${
            type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}
    >
        {type === 'success' ? <FiCheckCircle size={24} /> : <FiAlertTriangle size={24} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
            <FiX size={20} />
        </button>
    </motion.div>
);

// --- DoctorRow Component for managing individual row state ---

const DoctorRow = ({ doctor, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableDoctor, setEditableDoctor] = useState(doctor);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "address") {
            setEditableDoctor(prev => ({ ...prev, clinicLocation: { ...prev.clinicLocation, address: value } }));
        } else if (name === "consultationFee") {
            setEditableDoctor(prev => ({ ...prev, consultationFee: Number(value) || 0 }));
        } else {
            setEditableDoctor(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        await onUpdate(doctor._id, editableDoctor);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableDoctor(doctor); // Revert changes
        setIsEditing(false);
    };

    return (
        <motion.tr
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-b border-gray-200 last:border-b-0"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}`}
                        alt={`${doctor.name}'s avatar`}
                    />
                    <div className="font-semibold text-gray-800">{doctor.name}</div>
                </div>
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <input
                        type="text"
                        name="specialization"
                        value={editableDoctor.specialization || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiBriefcase className="text-indigo-500" />
                        <span>{doctor.specialization}</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <input
                        type="number"
                        name="consultationFee"
                        value={editableDoctor.consultationFee || ''}
                        onChange={handleInputChange}
                        className="w-32 p-2 border border-gray-300 rounded-md"
                    />
                ) : (
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <FaRupeeSign />
                        <span>{doctor.consultationFee?.toLocaleString('en-IN')}</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <input
                        type="text"
                        name="address"
                        value={editableDoctor.clinicLocation?.address || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="text-orange-500" />
                        <span>{doctor.clinicLocation?.address}</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200"><FiSave /></button>
                            <button onClick={handleCancel} className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"><FiX /></button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"><FiEdit /></button>
                    )}
                </div>
            </td>
        </motion.tr>
    );
};


// --- Main ManageDoctors Component ---

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const { data } = await getAllDoctors();
            setDoctors(data);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            showToast("Failed to fetch doctor data.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);
    
    useEffect(() => {
        if(toast.visible) {
            const timer = setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
    };

    const handleUpdateDoctor = async (id, updatedData) => {
        try {
            const { data } = await updateDoctor(id, updatedData);
            setDoctors(prev => prev.map(doc => doc._id === id ? data : doc));
            showToast("Doctor details updated successfully!", "success");
        } catch (err) {
            console.error("Error updating doctor:", err);
            showToast("Failed to update doctor. Please try again.", "error");
        }
    };

    const filteredDoctors = useMemo(() =>
        doctors.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        ), [doctors, searchTerm]);

    return (
        <Layout>
            <AnimatePresence>
                {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
            </AnimatePresence>

            <motion.div
                className="p-8 space-y-8 bg-slate-100 min-h-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800">Manage Doctors</h2>
                        <p className="text-lg text-gray-500 mt-1">View, search, and edit doctor details.</p>
                    </div>
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 w-full md:w-80 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="overflow-x-auto">
                            {filteredDoctors.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="bg-slate-50 text-xs text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4">Doctor</th>
                                            <th className="px-6 py-4">Specialization</th>
                                            <th className="px-6 py-4">Fee</th>
                                            <th className="px-6 py-4">Clinic Address</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody layout>
                                        {filteredDoctors.map(doc => (
                                            <DoctorRow key={doc._id} doctor={doc} onUpdate={handleUpdateDoctor} />
                                        ))}
                                    </motion.tbody>
                                </table>
                            ) : (
                                <EmptyState message={searchTerm ? "No doctors match your search." : "No doctors are available."} />
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}