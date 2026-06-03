import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { FiFileText, FiDownload, FiLoader, FiAlertTriangle, FiInbox, FiExternalLink } from 'react-icons/fi'; // Added FiExternalLink

const API_BASE_URL = 'https://docify-telemedical-web-1.onrender.com';

export default function ViewReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/reports/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not fetch your reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <FiLoader className="animate-spin text-blue-500 text-4xl mb-4" />
          <p className="text-slate-500 font-medium">Loading your reports...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded-r-lg">
            <div className="flex items-center">
                <FiAlertTriangle className="text-red-500 text-2xl mr-3" />
                <p className="text-red-700 font-semibold">{error}</p>
            </div>
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <div className="text-center py-16">
          <FiInbox className="mx-auto text-slate-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">No Reports Found</h3>
          <p className="text-slate-500 mt-2">Your uploaded medical reports will appear here.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-4">
        {reports.map(report => (
          <li
            key={report._id}
            className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all duration-300 hover:shadow-lg hover:border-blue-500/50 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 hidden sm:block">
                <FiFileText size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-800">{report.title}</p>
                <p className="text-sm text-slate-500">
                  Uploaded by <span className="font-medium">{report.uploadedBy?.name}</span> on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* START: Updated Button Group */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <a
                href={`${API_BASE_URL}${report.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow flex items-center justify-center text-sm"
              >
                <FiExternalLink className="mr-2" />
                View
              </a>
              <a
                href={`${API_BASE_URL}${report.fileUrl}`}
                download // This attribute triggers the download
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center text-sm"
              >
                <FiDownload className="mr-2" />
                Download
              </a>
            </div>
            {/* END: Updated Button Group */}

          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900">My Medical Reports</h1>
            <p className="text-md text-slate-600 mt-2">Access and manage all your medical documents securely in one place.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}