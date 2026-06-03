import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import docifyLogo from '../../assets/docify-logo.png'; // Adjust path if needed

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: 31 July 2025</p>

          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>Welcome to Docify ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal data in an open and transparent manner. This Privacy Policy explains how we collect, use, process, and disclose your information, including personal and sensitive data, in conjunction with your access to and use of the Docify platform.</p>
            
            <h2 className="text-2xl font-bold text-gray-800 pt-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, book an appointment, or communicate with us. This includes:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and government-issued ID (where required).</li>
              <li><strong>Health Information (Sensitive Personal Data):</strong> Medical history, health conditions, prescriptions, lab reports, and consultation notes that you provide or that are generated during your use of our services.</li>
              <li><strong>Communications:</strong> Any communication with doctors or our support team through the platform.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Provide, operate, and maintain our services.</li>
              <li>Facilitate consultations between you and healthcare providers.</li>
              <li>Process payments and send receipts.</li>
              <li>Communicate with you about appointments, updates, and support.</li>
              <li>Comply with legal obligations, including medical regulations in India.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">3. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>With Healthcare Providers:</strong> We share your health information with doctors on the platform for the purpose of providing you with medical care.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities, in compliance with Indian law, including the Digital Personal Data Protection Act (DPDP Act).</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">4. Data Security</h2>
            <p>We implement robust security measures, including encryption and access controls, to protect your personal and health information from unauthorized access, alteration, and disclosure.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">5. Your Rights</h2>
            <p>As per the DPDP Act, you have the right to access, correct, and request the erasure of your personal data. You can manage your information from your account dashboard or by contacting our support team.</p>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact our Grievance Officer at <a href="mailto:privacy@docify.com" className="text-indigo-600 hover:underline">privacy@docify.com</a>.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
