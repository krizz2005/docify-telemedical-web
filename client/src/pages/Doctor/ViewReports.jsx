// File Path: client/src/pages/Doctor/ViewReports.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { FiFileText, FiDownload, FiUser, FiChevronDown } from "react-icons/fi";

const API_BASE_URL = "https://docify-telemedical-web-1.onrender.com";

export default function ViewReports() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState("");

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      setLoadingPatients(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Could not load patient list.");
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, [user]);

  // Fetch reports when patient is selected
  useEffect(() => {
    if (!selectedPatient) {
      setReports([]);
      return;
    }
    const fetchReports = async () => {
      setLoadingReports(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/reports/${selectedPatient}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not fetch reports for this patient.");
      } finally {
        setLoadingReports(false);
      }
    };
    fetchReports();
  }, [selectedPatient]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Patient Reports
        </h1>

        {/* Patient Selector */}
        <div className="mb-10">
          <label
            htmlFor="patient-select"
            className="block font-medium mb-2 text-gray-700"
          >
            Select a Patient
          </label>
          <div className="relative">
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              disabled={loadingPatients}
              className="w-full border border-gray-300 p-3 pr-10 rounded-2xl shadow-sm bg-white disabled:bg-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">
                {loadingPatients
                  ? "Loading patients..."
                  : "-- Choose a patient --"}
              </option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <FiFileText className="mr-3 text-indigo-500" /> Uploaded Reports
          </h2>

          {loadingReports ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-20 bg-gray-100 rounded-xl"
                ></div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : reports.length > 0 ? (
            <ul className="space-y-5">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition transform flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {report.title}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <FiUser className="mr-1 text-indigo-400" />{" "}
                      {report.uploadedBy?.name} •{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={`${API_BASE_URL}${report.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg flex items-center font-medium transition"
                  >
                    <FiDownload className="mr-2" /> View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Reports"
                className="mx-auto w-28 opacity-70 mb-4"
              />
              <p className="text-gray-600 text-lg">
                {selectedPatient
                  ? "No reports found for this patient."
                  : "Please select a patient to view their reports."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
