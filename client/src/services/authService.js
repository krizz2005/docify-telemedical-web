import axios from 'axios';

// 🔗 API Base URL
const API_URL = process.env.REACT_APP_API_URL || 'https://docify-telemedical-web-1.onrender.com/api/auth';

// 🛡️ Axios instance (recommended)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Enable if using cookies for auth
});

// ➤ Register
export const register = async (data) => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message };
  }
};

// ➤ Login
export const login = async (data) => {
  try {
    const response = await api.post('/login', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message };
  }
};

// ➤ Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message };
  }
};

// ✅ ➤ Reset Password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message };
  }
};
