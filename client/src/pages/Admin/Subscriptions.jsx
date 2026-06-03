// client/src/pages/Admin/Subscriptions.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiAlertTriangle, FiStar, FiCalendar, FiClock, FiUsers, FiX } from "react-icons/fi";
import { format } from 'date-fns';
import Layout from "../../components/Layout";
import { getAllSubscriptions } from "../../services/adminService";

// --- Reusable Sub-Components ---

const StatusPill = ({ status }) => {
    const styles = {
        active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        expired: 'bg-rose-100 text-rose-800 border-rose-200',
        cancelled: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md">
        <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Subscriptions Found</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
);

// --- Main Component ---

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await getAllSubscriptions();
            setSubscriptions(data);
        } catch (err) {
            console.error("Failed to fetch subscriptions:", err);
            setError("Failed to load subscriptions. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);
    
    const safeFormatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString))) {
            return '—'; // Return a dash for invalid or missing dates
        }
        return format(new Date(dateString), 'dd MMM, yyyy');
    };

    const filteredSubscriptions = useMemo(() =>
        subscriptions.filter(sub => {
            const patientName = sub.patientId?.name?.toLowerCase() || '';
            const patientEmail = sub.patientId?.email?.toLowerCase() || '';
            const plan = sub.plan?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();
            
            return patientName.includes(search) || patientEmail.includes(search) || plan.includes(search);
        }), [subscriptions, searchTerm]);

    return (
        <Layout>
            <motion.div
                className="p-8 space-y-8 bg-slate-100 min-h-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800">User Subscriptions</h2>
                        <p className="text-lg text-gray-500 mt-1">View and search all active and past subscriptions.</p>
                    </div>
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by patient, email, or plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 w-full md:w-80 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                        <FiAlertTriangle /> <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto"><FiX /></button>
                    </div>
                )}
                
                {/* --- Subscriptions Table --- */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="overflow-x-auto">
                           {filteredSubscriptions.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="bg-slate-50 text-xs text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Patient</th>
                                            <th scope="col" className="px-6 py-4">Plan</th>
                                            <th scope="col" className="px-6 py-4">Duration</th>
                                            <th scope="col" className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody>
                                        {filteredSubscriptions.map((sub) => (
                                            <motion.tr
                                                key={sub._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${sub.patientId?.name || 'User'}`}
                                                            alt={`${sub.patientId?.name || 'User'}'s avatar`}
                                                        />
                                                        <div>
                                                            <div className="font-semibold">{sub.patientId?.name || 'N/A'}</div>
                                                            <div className="font-normal text-gray-500">{sub.patientId?.email || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FiStar className="text-amber-500" />
                                                        <span className="font-semibold capitalize">{sub.plan}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <FiCalendar className="text-emerald-500"/>
                                                            <span>{safeFormatDate(sub.startDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiClock className="text-rose-500"/>
                                                            <span>{safeFormatDate(sub.endDate)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusPill status={sub.status} />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            ) : (
                               <EmptyState message={searchTerm ? "No subscriptions match your search." : "There are no subscriptions to display."} />
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}