import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

// Utility to generate a random room ID
function generateRandomRoomId() {
  return 'room-' + Math.random().toString(36).substr(2, 9);
}

export default function VideoConsultation({ patientId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'doctor') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Access Denied: Doctors only
      </div>
    );
  }

  const startCall = () => {
    const roomId = generateRandomRoomId();
    navigate(`/video-call/${roomId}?patientId=${patientId || 'unknown'}`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Start Video Consultation</h2>
        <p className="mb-6 text-gray-700">
          Click the button below to start a secure video consultation with your patient.
        </p>
        <button
          onClick={startCall}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow-md transition"
        >
          Start Consultation
        </button>
      </div>
    </Layout>
  );
}
