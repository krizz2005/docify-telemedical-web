// File Path: client/src/pages/Patient/MyAppointments.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { FiCalendar, FiClock, FiUser, FiVideo } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000';

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      // --- THE FIX ---
      // 1. Wait until the user object and its _id are available.
      if (!user?._id) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        // 2. Use the correct property name: user._id
        const res = await axios.get(`${API_BASE_URL}/api/appointments/patient/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err.response?.data || err.message);
        setError('Could not load your appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]); // The effect re-runs when the user object is loaded

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">My Appointments</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading your appointments...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : appointments.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <p className="text-gray-500">You have no appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500 transition-transform transform hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <FiUser className="text-indigo-500 mr-3" />
                      <p className="font-bold text-xl text-gray-800">Dr. {appt.doctor?.name || 'N/A'}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">{appt.doctor?.specialization || 'General'}</p>
                  </div>
                  <div className={`mt-4 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full h-fit ${getStatusStyles(appt.status)}`}>
                    {appt.status}
                  </div>
                </div>
                <div className="border-t my-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    <span>{new Date(appt.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2 text-gray-400" />
                    <span>{appt.time}</span>
                  </div>
                  <div className="flex items-center">
                    <FiVideo className="mr-2 text-gray-400" />
                    <span className="capitalize">{appt.mode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
