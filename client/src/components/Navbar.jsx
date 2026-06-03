import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 flex justify-between items-center shadow">
      <div className="font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>Docify</div>
      <div className="flex items-center gap-6">
        <span className="text-sm">Logged in as: <strong>{user.role}</strong></span>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">Logout</button>
      </div>
    </nav>
  );
}