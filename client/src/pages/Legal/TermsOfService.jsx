import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import docifyLogo from '../../assets/docify-logo.png'; // Adjust path if needed

const TermsOfService = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
       <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={docifyLogo} alt="Docify Logo" className="w-10 h-10" />
            <span className="text-2xl font-extrabold text-indigo-900">Docify</span>
          </Link>
          <Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
            Back to Login
          </Link>
        </div>
      </nav>
      
      <motion.div 
        className="container mx-auto px-6 py-12 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: 31 July 2025</p>

          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>Please read these Terms of Service ("Terms") carefully before using the Docify platform operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.</p>
            
            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. Scope of Service</h2>
            <p>Docify is a technology platform that connects patients with registered medical practitioners ("Doctors"). We are not a healthcare provider. The diagnosis and treatment you receive from Doctors through the platform are the sole responsibility of the Doctor.</p>
            <p><strong>This service is not for medical emergencies.</strong> In case of a medical emergency, please contact your local emergency services immediately.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. User Responsibilities</h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Provide any false or misleading information.</li>
              <li>Violate any applicable laws or regulations in India.</li>
              <li>Impersonate any person or entity.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">5. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our registered office is in Mumbai, Maharashtra.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
