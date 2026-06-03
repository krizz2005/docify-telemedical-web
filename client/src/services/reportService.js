import axios from 'axios';

const API = 'http://localhost:5000/api/reports';

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
