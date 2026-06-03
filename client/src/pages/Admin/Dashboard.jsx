// client/src/pages/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiUsers, FiBriefcase, FiBarChart2, FiActivity, FiCheckCircle, 
    FiAlertCircle, FiTrendingUp, FiTrendingDown, FiUserCheck, 
    FiMessageSquare, FiInbox 
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Defs, LinearGradient, Stop } from 'recharts';
import Layout from '../../components/Layout';
import { getAdminDashboardStats } from '../../services/adminService';

// This initialData structure must match what your backend API sends
const initialData = {
  stats: {
    totalPatients: { value: 0, trend: 0 },
    totalDoctors: { value: 0, trend: 0 },
    totalAppointments: { value: 0, trend: 0 },
    monthlyRevenue: { value: 0, trend: 0 },
  },
  revenueData: [],
  userGrowthData: [],
  pendingDoctors: [],
  supportTickets: [],
};

// --- Main Dashboard Component ---

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      const { data } = await getAdminDashboardStats();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error(err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
    const intervalId = setInterval(() => fetchDashboardData(false), 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-screen bg-slate-100"><div className="text-xl font-semibold text-gray-600">Loading Admin Dashboard...</div></div></Layout>;
  }

  if (error) {
    return <Layout><div className="p-6 text-center text-lg text-red-500 bg-red-50 rounded-lg">{error}</div></Layout>;
  }

  return (
    <Layout>
      <motion.div
        className="p-8 space-y-10 bg-slate-100 min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
            <h2 className="text-4xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-lg text-gray-500 mt-1">Live statistics for Docify. Data refreshes automatically. (Last updated: {new Date().toLocaleTimeString()})</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard icon={<FiUsers />} title="Total Patients" value={dashboardData.stats.totalPatients.value} trend={dashboardData.stats.totalPatients.trend} color="sky" />
          <StatCard icon={<FiBriefcase />} title="Total Doctors" value={dashboardData.stats.totalDoctors.value} trend={dashboardData.stats.totalDoctors.trend} color="amber" />
          <StatCard icon={<FiActivity />} title="Appointments This Month" value={dashboardData.stats.totalAppointments.value} trend={dashboardData.stats.totalAppointments.trend} color="emerald" />
          <StatCard icon={<FiBarChart2 />} title="Monthly Revenue (₹)" value={dashboardData.stats.monthlyRevenue.value.toLocaleString('en-IN')} trend={dashboardData.stats.monthlyRevenue.trend} color="rose" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <ChartBox title="Revenue Overview (Last 6 Months)" className="lg:col-span-3">
             <ResponsiveContainer width="100%" height={350}>
               <BarChart data={dashboardData.revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                 <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                 <YAxis tickFormatter={(value) => `₹${value/1000}k`} tick={{ fill: '#6b7280' }} />
                 <Tooltip content={<CustomTooltip />} />
                 <Legend />
                 <Bar dataKey="revenue" fill="url(#colorRevenue)" name="Total Revenue" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </ChartBox>
          <ChartBox title="User Growth (Last 6 Months)" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dashboardData.userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#22c55e" strokeWidth={2} name="New Patients" dot={{ r: 4 }} activeDot={{ r: 8 }}/>
                  <Line type="monotone" dataKey="doctors" stroke="#f59e0b" strokeWidth={2} name="New Doctors" />
                </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ActionList title="Pending Doctor Approvals" items={dashboardData.pendingDoctors} link="/admin/doctor-approvals" />
          <ActionList title="Recent Support Tickets" items={dashboardData.supportTickets} link="/admin/support-tickets" />
        </div>
      </motion.div>
    </Layout>
  );
}


// --- Reusable Components ---

const StatCard = ({ icon, title, value, trend, color }) => {
  const trendIcon = trend >= 0 ? <FiTrendingUp /> : <FiTrendingDown />;
  const trendColor = trend >= 0 ? 'text-emerald-500' : 'text-red-500';
  
  const colors = {
      sky: { bg: 'from-sky-500 to-sky-400', text: 'text-sky-800' },
      amber: { bg: 'from-amber-500 to-amber-400', text: 'text-amber-800' },
      emerald: { bg: 'from-emerald-500 to-emerald-400', text: 'text-emerald-800' },
      rose: { bg: 'from-rose-500 to-rose-400', text: 'text-rose-800' },
  };

  return (
    <motion.div 
      className={`relative bg-gradient-to-br ${colors[color].bg} text-white p-6 rounded-2xl shadow-lg overflow-hidden transition-all duration-300`}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)' }}
    >
      <div className={`absolute -right-4 -bottom-4 text-7xl opacity-20 ${colors[color].text}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
          <div className={`flex items-center gap-1 font-semibold ${trendColor} bg-white/90 px-2.5 py-1 rounded-full text-sm`}>
             {trendIcon}
             <span>{trend}%</span>
          </div>
        </div>
        <p className="text-3xl font-bold mt-4">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
      </div>
    </motion.div>
  );
};

const ChartBox = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200 ${className}`}>
    <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
    {children}
  </div>
);

const ActionList = ({ title, items, link }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <Link to={link} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All &rarr;</Link>
    </div>
    <ul className="space-y-3">
      {items && items.length > 0 ? items.slice(0, 5).map(item => (
        <li key={item._id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
          <div className="flex items-center gap-4">
             <div className={`p-2 rounded-full ${title.includes('Doctor') ? 'bg-sky-100 text-sky-600' : 'bg-amber-100 text-amber-600'}`}>
                {title.includes('Doctor') ? <FiUserCheck /> : <FiMessageSquare />}
            </div>
            <div>
              <p className="font-semibold text-gray-700">{item.name || item.subject}</p>
              <p className="text-sm text-gray-500">{item.email || `ID: ${item._id.slice(-6)}`}</p>
            </div>
          </div>
          <StatusPill status={item.status} />
        </li>
      )) : <EmptyState />}
    </ul>
  </div>
);

const StatusPill = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        open: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const EmptyState = () => (
    <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100">
            <FiInbox className="h-6 w-6 text-slate-500" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
        <p className="mt-1 text-sm text-gray-500">No pending items to show here.</p>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-700">{label}</p>
        {payload.map((pld, index) => (
            <p key={index} style={{ color: pld.stroke || pld.fill }}>
               {`${pld.name}: `}
               {pld.dataKey === 'revenue' 
                   ? `₹${pld.value.toLocaleString('en-IN')}` 
                   : pld.value
               }
            </p>
        ))}
      </div>
    );
  }
  return null;
};