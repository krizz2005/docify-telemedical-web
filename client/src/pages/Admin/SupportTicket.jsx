// client/src/pages/Admin/SupportTicket.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// FIX 1: Added FiAlertTriangle to the import list
import { FiMail, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare, FiMoreVertical, FiX, FiInbox, FiAlertTriangle } from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';
import Layout from "../../components/Layout";
import { getSupportTickets, updateSupportTicket } from "../../services/adminService";

// --- Reusable Sub-Components ---

const Toast = ({ message, type, onClose }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.5 }}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl text-white ${
            type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}
    >
        {type === 'success' ? <FiCheckCircle size={24} /> : <FiAlertTriangle size={24} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2"><FiX size={20} /></button>
    </motion.div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10 h-96">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 px-6 col-span-full">
        <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">All Clear!</h3>
        <p className="mt-2 text-md text-gray-500">There are no support tickets to display.</p>
    </div>
);

const PriorityPill = ({ priority }) => {
    const styles = {
        high: 'bg-rose-100 text-rose-800',
        medium: 'bg-amber-100 text-amber-800',
        low: 'bg-emerald-100 text-emerald-800',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${styles[priority]}`}>{priority}</span>;
};


// --- Ticket Card Component ---

const TicketCard = ({ ticket, onStatusChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const priorityBorders = {
        high: 'border-t-4 border-rose-500',
        medium: 'border-t-4 border-amber-500',
        low: 'border-t-4 border-emerald-500',
    };

    const handleAction = (status) => {
        onStatusChange(ticket._id, { status });
        setMenuOpen(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-5 space-y-4 ${priorityBorders[ticket.priority]}`}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800 pr-2">{ticket.subject}</h3>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-full hover:bg-gray-100">
                        <FiMoreVertical className="text-gray-500" />
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                            >
                                {ticket.status !== 'open' && <button onClick={() => handleAction('open')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mark as Open</button>}
                                {ticket.status !== 'pending' && <button onClick={() => handleAction('pending')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mark as In Progress</button>}
                                {ticket.status !== 'resolved' && <button onClick={() => handleAction('resolved')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mark as Resolved</button>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <details className="text-sm text-gray-600">
                <summary className="cursor-pointer text-indigo-600 hover:underline">View Description</summary>
                <p className="mt-2 prose prose-sm">{ticket.description}</p>
            </details>

            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <img
                        className="h-8 w-8 rounded-full"
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.user?.email || 'A'}`}
                        alt="user avatar"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-700">{ticket.user?.email || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">
                            Submitted {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <PriorityPill priority={ticket.priority} />
                </div>
            </div>
        </motion.div>
    );
};


// --- Kanban Column Component ---

// FIX 2: Accept `onStatusChange` as a prop and pass it down to TicketCard
const KanbanColumn = ({ title, tickets, color, onStatusChange }) => (
    <div className="bg-slate-100 rounded-xl p-4 flex-1">
        <div className={`flex items-center justify-between px-2 pb-4 border-b-2 ${color.border}`}>
            <h3 className={`font-semibold text-lg ${color.text}`}>{title}</h3>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${color.bg} ${color.text}`}>{tickets.length}</span>
        </div>
        <div className="pt-4 space-y-4 h-full overflow-y-auto">
            {tickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} onStatusChange={onStatusChange} />
            ))}
        </div>
    </div>
);


// --- Main Component ---

export default function SupportTicket() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const { data } = await getSupportTickets();
            setTickets(data);
        } catch (err) {
            console.error("Error fetching tickets", err);
            setError("Failed to load support tickets. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTickets();
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

    const handleStatusChange = async (id, newStatus) => {
        const originalTickets = [...tickets];
        setTickets(prev => prev.map(t => t._id === id ? { ...t, ...newStatus } : t));

        try {
            await updateSupportTicket(id, newStatus);
            showToast("Ticket status updated!", "success");
        } catch (err) {
            console.error("Error updating ticket", err);
            showToast("Failed to update ticket.", "error");
            setTickets(originalTickets);
        }
    };

    const groupedTickets = useMemo(() => {
        return tickets.reduce((acc, ticket) => {
            const status = ticket.status || 'open';
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(ticket);
            return acc;
        }, { open: [], pending: [], resolved: [] });
    }, [tickets]);

    const columnConfig = {
        open: { title: "Open", color: { text: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-500' } },
        pending: { title: "In Progress", color: { text: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-500' } },
        resolved: { title: "Resolved", color: { text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-500' } },
    };

    return (
        <Layout>
            <AnimatePresence>
                {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
            </AnimatePresence>
            <motion.div
                className="p-8 bg-slate-100 min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">Support Tickets</h2>
                    <p className="text-lg text-gray-500 mt-1">Manage and resolve user queries from the support queue.</p>
                </div>
                
                {loading && <LoadingSpinner />}
                {error && <p className="p-6 text-center text-red-500 bg-red-50 rounded-lg">{error}</p>}
                
                {!loading && !error && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {tickets.length === 0 ? <EmptyState /> : (
                            Object.entries(groupedTickets).map(([status, ticketsInStatus]) => (
                                <KanbanColumn
                                    key={status}
                                    title={columnConfig[status].title}
                                    color={columnConfig[status].color}
                                    tickets={ticketsInStatus}
                                    onStatusChange={handleStatusChange}
                                />
                            ))
                        )}
                    </div>
                )}
            </motion.div>
        </Layout>
    );
}