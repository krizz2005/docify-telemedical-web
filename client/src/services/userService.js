import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/users';

export const getAllUsers = async (token) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async (userId, token) => {
  return await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
