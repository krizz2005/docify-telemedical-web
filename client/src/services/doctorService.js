import axios from 'axios';
const API = 'https://docify-telemedical-web-1.onrender.com/api/doctor';

export const getDoctorAppointments = async (token) =>
  await axios.get(`${API}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAppointmentStatus = async (id, status, token) =>
  await axios.patch(`${API}/appointments/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
