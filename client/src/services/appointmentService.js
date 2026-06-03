import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

export const getAppointmentsByDoctorId = async (doctorId, token) => {
  return await axios.get(`${API_URL}/doctor/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAppointmentStatus = async (appointmentId, status, token) => {
  return await axios.put(`${API_URL}/status/${appointmentId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
