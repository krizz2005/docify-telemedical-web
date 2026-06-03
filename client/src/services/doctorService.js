import axios from 'axios';
const API = 'http://localhost:5000/api/doctor';

export const getDoctorAppointments = async (token) =>
  await axios.get(`${API}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAppointmentStatus = async (id, status, token) =>
  await axios.patch(`${API}/appointments/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
