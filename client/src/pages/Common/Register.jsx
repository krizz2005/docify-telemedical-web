// src/pages/Register/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../../services/authService'; // adjust path if needed
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUsers } from 'react-icons/fi';

// Animation variants for Framer Motion (same as login for consistency)
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- Validation ---
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerService(formData);
      setSuccess('Registration successful! Redirecting to login...');
      // Redirect to login after a short delay to allow user to read the message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Pane - Illustration */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-400 to-green-500 p-12 flex-col items-center justify-center text-white">
            <motion.img
              src="/assets/docify-common.png"
              alt="Docify Illustration"
              className="w-48 mb-6"
              variants={itemVariants}
            />
            <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">Join Our Community</motion.h1>
            <motion.p variants={itemVariants} className="text-center text-green-100">Get seamless access to healthcare services.</motion.p>
          </div>

          {/* Right Pane - Registration Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2 text-gray-800">Create Account</motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mb-8">Let's get you started!</motion.p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Form Inputs with Icons --- */}
              <motion.div variants={itemVariants} className="relative">
                <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
              </motion.div>
              
              <motion.div variants={itemVariants} className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"><FiEye/></button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
  <FiUsers className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none 
               focus:ring-2 focus:ring-green-500 transition appearance-none"
  >
    <option value="patient">Register as a Patient</option>
    <option value="doctor">Register as a Doctor</option>
    {/* 🔒 Removed admin option */}
  </select>
</motion.div>


              {/* --- Feedback Messages --- */}
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">{error}</motion.p>}
              {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-sm text-center">{success}</motion.p>}

              <motion.div variants={itemVariants}>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-transform duration-200 transform hover:scale-105 disabled:bg-green-300 disabled:cursor-not-allowed" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-semibold text-green-600 hover:underline">Login here</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* --- Footer --- */}
      <footer className="text-center p-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Docify. All Rights Reserved. | 
        <Link to="/privacy" className="hover:underline mx-2">Privacy Policy</Link> | 
        <Link to="/terms" className="hover:underline mx-2">Terms of Service</Link>
      </footer>
    </div>
  );
}