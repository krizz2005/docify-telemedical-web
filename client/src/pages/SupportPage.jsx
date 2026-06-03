import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMessageSquare, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// It's better to manage the logo URL here or via a config
const DOCIFY_LOGO_URL = 'https://placehold.co/40x40/6366f1/ffffff?text=D';

const SupportPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Assuming your server is running on the same domain or you have a proxy setup.
      // For development, you might need the full URL like 'http://localhost:3001/api/support'
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Always try to parse the JSON body, even for errors
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Your message has been sent! We will get back to you shortly.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // *** IMPORTANT CHANGE ***
        // Display the specific error message from the server's JSON response
        setStatus({ type: 'error', message: data.error || 'An unexpected error occurred.' });
      }
    } catch (err) {
      console.error('Support form submission failed:', err);
      setStatus({ type: 'error', message: 'Could not connect to the server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  // A simple mock for the Link component since react-router-dom isn't fully set up here.
  const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={DOCIFY_LOGO_URL} alt="Docify Logo" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-extrabold text-indigo-900">Docify</span>
          </Link>
          <Link to="/" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
            Back to Home
          </Link>
        </div>
      </nav>

      <motion.div
        className="container mx-auto px-6 py-12 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">Contact Support</h1>
            <p className="text-slate-600 mt-2">We're here to help. Fill out the form below and we'll get back to you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>
            <div className="relative">
              <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>
            <div className="relative">
              <FiMessageSquare className="absolute top-5 left-4 text-gray-400" />
              <textarea name="message" placeholder="Describe your issue..." value={formData.message} onChange={handleChange} rows="5" required className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
            </div>

            {status.type && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center p-4 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {status.type === 'success' ? <FiCheckCircle className="mr-3 flex-shrink-0" /> : <FiAlertCircle className="mr-3 flex-shrink-0" />}
                <span>{status.message}</span>
              </motion.div>
            )}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg text-lg font-semibold transition-transform duration-200 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Submitting...' : 'Send Message'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SupportPage;
