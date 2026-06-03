// File: src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

// Animation variants for Framer Motion
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      // API request to backend
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (!res.data?.user || !res.data?.token) {
        throw new Error("Invalid login response from server");
      }

      // Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update AuthContext
      login(res.data.user, res.data.token);

      // Redirect by role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
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
          {/* Left Pane - Illustration and Welcome Message */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-12 flex-col items-center justify-center text-white">
            <motion.img
              src="/assets/docify-common.png"
              alt="Docify Illustration"
              className="w-48 mb-6"
              variants={itemVariants}
            />
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-center text-blue-100"
            >
              Your health, your records, all in one secure place.
            </motion.p>
          </div>

          {/* Right Pane - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold mb-2 text-gray-800"
            >
              Login to Docify
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-500 mb-8"
            >
              Please enter your credentials.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="relative">
                <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </motion.div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-transform duration-200 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </motion.div>
            </form>

            {/* Links */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center text-sm"
            >
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:underline"
              >
                Register here
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-2 text-center text-sm"
            >
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="text-center p-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Docify. All Rights Reserved. |
        <Link to="/privacy" className="hover:underline mx-2">
          Privacy Policy
        </Link>
        |
        <Link to="/terms" className="hover:underline mx-2">
          Terms of Service
        </Link>
      </footer>
    </div>
  );
}