// File Path: client/src/pages/Doctor/PatientList.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { FiUser, FiArrowRight } from 'react-icons/fi';

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Could not fetch patient list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleViewDetails = (patientId) => {
    navigate(`/doctor/patient-details/${patientId}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">My Patients</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading patient list...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : patients.length > 0 ? (
            <ul className="space-y-4">
              {patients.map((patient) => (
                <li
                  key={patient._id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-full mr-4">
                        <FiUser className="text-indigo-600" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-gray-800">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(patient._id)}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center"
                  >
                    View Records <FiArrowRight className="ml-2" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">You do not have any patients with a recorded appointment history yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
