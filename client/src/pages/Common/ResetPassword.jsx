import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert('Passwords do not match');

    try {
      await resetPassword(token, password);
      alert('Password reset successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Reset Your Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input type="password" placeholder="New Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button type="submit" className="btn-blue">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
