import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword as forgotPasswordService } from '../../services/authService';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';

// Animation Variants for the design
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // --- User's Original handleSubmit Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordService(email);
      alert('If your email exists, a reset link was sent!');
      navigate('/login'); // ✅ Back to login
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password!');
      console.error(err);
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
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-12 flex-col items-center justify-center text-white">
            <motion.img
              src="/assets/docify-common.png" // Reusing the common asset for consistency
              alt="Docify Illustration"
              className="w-48 mb-6"
              variants={itemVariants}
            />
            <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">Account Recovery</motion.h1>
            <motion.p variants={itemVariants} className="text-center text-orange-100">Enter your email to receive a reset link.</motion.p>
          </div>

          {/* Right Pane - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2 text-gray-800">Forgot Password?</motion.h2>
              <motion.p variants={itemVariants} className="text-gray-500 mb-8">No worries, we'll send you reset instructions.</motion.p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="relative">
                  <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-transform duration-200 transform hover:scale-105"
                  >
                    Send Reset Link
                  </button>
                </motion.div>
              </form>
              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                  &larr; Back to Login
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="text-center p-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Docify. All Rights Reserved. | 
        <Link to="/privacy" className="hover:underline mx-2">Privacy Policy</Link> | 
        <Link to="/terms" className="hover:underline mx-2">Terms of Service</Link>
      </footer>
    </div>
  );
}
