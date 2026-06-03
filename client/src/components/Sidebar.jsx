import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const commonClasses = "block py-2 px-4 hover:bg-blue-100 rounded transition";

  const adminLinks = (
    <>
      <Link className={commonClasses} to="/admin/dashboard">Dashboard</Link>
      <Link className={commonClasses} to="/admin/users">Manage Users</Link>
      <Link className={commonClasses} to="/admin/appointments">Appointments</Link>
      <Link className={commonClasses} to="/admin/subscriptions">Subscriptions</Link>
      <Link className={commonClasses} to="/admin/support-tickets">Recent Support Ticket</Link>
    </>
  );

  const doctorLinks = (
    <>
      <Link className={commonClasses} to="/doctor/dashboard">Dashboard</Link>
      <Link className={commonClasses} to="/doctor/appointments">Appointments</Link>
      <Link className={commonClasses} to="/doctor/upload-report">Upload Reports</Link>
      <Link className={commonClasses} to="/doctor/reports">View Reports</Link>
      <Link className={commonClasses} to="/doctor/my-patients">My Patients</Link>
      <Link className={commonClasses} to="/doctor/support-page">Raise Support Ticket</Link>
    </>
  );

  const patientLinks = (
    <>
      <Link className={commonClasses} to="/patient/dashboard">Dashboard</Link>
      <Link className={commonClasses} to="/patient/book-appointment">Book Appointment</Link>
      <Link className={commonClasses} to="/patient/my-appointments">My Appointments</Link>
      <Link className={commonClasses} to="/patient/upload-report">Upload Report</Link>
      <Link className={commonClasses} to="/patient/reports">View Reports</Link>
      <Link className={commonClasses} to="/patient/subscription">Subscription</Link>
      <Link className={commonClasses} to="/patient/support-page">Raise Support Ticket</Link>
    </>
  );

  return (
    <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
      <h2 className="font-bold text-lg text-gray-700">Menu</h2>
      {user.role === 'admin' && adminLinks}
      {user.role === 'doctor' && doctorLinks}
      {user.role === 'patient' && patientLinks}
    </aside>
  );
}
