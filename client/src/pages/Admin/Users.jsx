// client/src/pages/Admin/ManageUsers.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiSearch, FiAlertTriangle, FiUsers, FiX, FiCheckCircle } from "react-icons/fi";
import Layout from "../../components/Layout";
import { getAllUsers, deleteUser } from "../../services/adminService";
import { format } from 'date-fns';

// --- Reusable Sub-Components ---

const RolePill = ({ role }) => {
    const styles = {
        admin: 'bg-rose-100 text-rose-800 border border-rose-200',
        doctor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        patient: 'bg-sky-100 text-sky-800 border border-sky-200',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
            {role}
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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Users Found</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
);

const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl text-white ${
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 m-4"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FiAlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Delete User</h3>
                        <p className="mt-2 text-gray-600">
                            Are you sure you want to delete <strong className="text-gray-900">{userName}</strong>? This action cannot be undone.
                        </p>
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Main Component ---

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    
    // --- This should come from your global state/auth context (e.g., Redux, Zustand, React Context)
    // --- It's crucial for preventing an admin from deleting their own account.
    const currentUser = { email: 'admin@docify.com' }; 

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    // --- Effect to manage toast visibility ---
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete._id);
            setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
            showToast("User deleted successfully!", "success");
        } catch (err) {
            console.error("Error deleting user:", err);
            showToast("Failed to delete user. Please try again.", "error");
        } finally {
            setUserToDelete(null); // Close modal regardless of outcome
        }
    };

    const filteredUsers = useMemo(() =>
        users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    return (
        <Layout>
            <AnimatePresence>
                {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
                userName={userToDelete?.name}
            />
            <motion.div
                className="p-8 space-y-8 bg-slate-100 min-h-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800">Manage Users</h2>
                        <p className="text-lg text-gray-500 mt-1">View, search, and manage all users.</p>
                    </div>
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                
                {/* --- Users Table --- */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {loading ? (
                        <LoadingSpinner />
                    ) : filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-slate-50 text-xs text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">User</th>
                                        <th scope="col" className="px-6 py-4">Role</th>
                                        <th scope="col" className="px-6 py-4">Joined On</th>
                                        <th scope="col" className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <motion.tbody layout>
                                    {filteredUsers.map((user) => {
                                        const isCurrentUser = user.email === currentUser.email;
                                        return (
                                            <motion.tr
                                                key={user._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                                            alt={`${user.name}'s avatar`}
                                                        />
                                                        <div>
                                                            <div className="font-semibold">{user.name}</div>
                                                            <div className="font-normal text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <RolePill role={user.role} />
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {user.createdAt && !isNaN(new Date(user.createdAt))
                                                        ? format(new Date(user.createdAt), 'dd MMM, yyyy')
                                                        : '—'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        disabled={isCurrentUser}
                                                        className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                                                        aria-label={`Delete ${user.name}`}
                                                        title={isCurrentUser ? "You cannot delete your own account." : `Delete ${user.name}`}
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </motion.tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState message={searchTerm ? "No users match your search criteria." : "There are no users to display yet."} />
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}
