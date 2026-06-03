import axios from 'axios';

const API = 'https://docify-telemedical-web-1.onrender.com/api/reports';

export const uploadReport = async (formData, token) => {
  return await axios.post(`${API}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReportsByPatientId = async (patientId, token) => {
  return await axios.get(`${API}/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
