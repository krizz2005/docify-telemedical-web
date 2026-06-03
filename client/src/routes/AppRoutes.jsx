// src/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from '../components/GuestRoute';
import { useAuth } from '../context/AuthContext';

// 🌐 Public Pages
import LandingPage from '../pages/LandingPage';
import FaqPage from '../pages/FaqPage';
import SupportPage from '../pages/SupportPage';
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsOfService from '../pages/Legal/TermsOfService';

// Common Pages
import Login from '../pages/Common/Login';
import Register from '../pages/Common/Register';
import ForgotPassword from '../pages/Common/ForgotPassword';
import Videocall from '../pages/Common/Videocall';
import ResetPassword from '../pages/Common/ResetPassword';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Users';
import Appointments from '../pages/Admin/Appointments';
import Subscriptions from '../pages/Admin/Subscriptions';
import Settings from '../pages/Admin/Settings';
import SupportTicket from '../pages/Admin/SupportTicket'; 
import DoctorApprovals from '../pages/Admin/DoctorApprovals';

// Doctor Pages
import DoctorDashboard from '../pages/Doctor/Dashboard';
import DoctorAvailability from '../pages/Doctor/DoctorAvailability';
import DoctorAppointments from '../pages/Doctor/Appointments';
import UploadsReport from '../pages/Doctor/UploadsReport';
import PatientDetails from '../pages/Doctor/PatientDetails';
import VideoConsultation from '../pages/Doctor/VideoConsultation';
import MyPatients from '../pages/Doctor/MyPatients';
import DoctorViewReports from '../pages/Doctor/ViewReports';
import DoctorSupportPage from '../pages/Doctor/SupportPage';
import DoctorDetailsForm from '../pages/Doctor/DoctorDetailsForm';


// Patient Pages
import PatientDashboard from '../pages/Patient/Dashboard';
import BookAppointment from '../pages/Patient/BookAppointment';
import MyAppointments from '../pages/Patient/MyAppointments';
import UploadPatientReport from '../pages/Patient/UploadReport';
import PatientViewReports from '../pages/Patient/ViewReports';
import Subscription from '../pages/Patient/Subscription';
import PatientSupportPage from '../pages/Patient/SupportPage';
import StoredFiles from '../pages/Patient/StoredFiles';
import DietPlan from "../pages/Patient/DietPlan";
import Videos from "../pages/Patient/Videos";
 

export default function AppRoutes() {
  const { user } = useAuth(); // <- currently unused, can be removed if not needed here

  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/video-call/:roomId" element={<Videocall />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🛠 Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><Appointments /></ProtectedRoute>} />
        <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['admin']}><Subscriptions /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
        <Route path="/admin/support-tickets" element={<ProtectedRoute allowedRoles={['admin']}><SupportTicket /></ProtectedRoute>}/>
        <Route path="/admin/doctor-approvals" element={<ProtectedRoute allowedRoles={['admin']}><DoctorApprovals /></ProtectedRoute>} />

        {/* 🩺 Doctor Routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor/availability" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAvailability /></ProtectedRoute>} />
         <Route path="/doctor/upload-report" element={<UploadsReport />} />
        <Route path="/doctor/patient-details/:patientId" element={<ProtectedRoute allowedRoles={['doctor']}><PatientDetails /></ProtectedRoute>} />
        <Route path="/doctor/my-patients" element={<ProtectedRoute allowedRoles={['doctor']}><MyPatients /></ProtectedRoute>} />
        <Route path="/doctor/reports" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorViewReports /></ProtectedRoute>} />
        <Route path="/doctor/video-consult" element={<ProtectedRoute allowedRoles={['doctor']}><VideoConsultation /></ProtectedRoute>} />
        <Route path="/doctor/support-page" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorSupportPage /></ProtectedRoute>} />
        <Route path="/doctor/complete-profile" element={<DoctorDetailsForm />} />

        {/* 🧑‍⚕ Patient Routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path="/patient/my-appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
        <Route path="/patient/upload-report" element={<ProtectedRoute allowedRoles={['patient']}><UploadPatientReport /></ProtectedRoute>} />
        <Route path="/patient/reports" element={<ProtectedRoute allowedRoles={['patient']}><PatientViewReports /></ProtectedRoute>} />
        <Route path="/patient/subscription" element={<ProtectedRoute allowedRoles={['patient']}><Subscription /></ProtectedRoute>} />
        <Route path="/patient/support-page" element={<ProtectedRoute allowedRoles={['patient']}><PatientSupportPage /></ProtectedRoute>} />
        <Route path="/patient/stored-files"element={<ProtectedRoute allowedRoles={['patient']}><StoredFiles /></ProtectedRoute>} />
        <Route path="/patient/diet-plan" element={<DietPlan />} />
        <Route path="/patient/videos" element={<Videos />} />

        {/* 🚫 404 Page */}
        <Route path="*" element={
          <div className="text-center p-8 text-2xl font-bold">
            404 - Page Not Found
          </div>
        } />
      </Routes>
    </Router>
  );
}
