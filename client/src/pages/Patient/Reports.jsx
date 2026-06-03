import React, { useState, useEffect } from 'react';
import { uploadReport, getReportsByPatientId } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';

export default function Reports() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await getReportsByPatientId(user.id);
    setReports(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('report', file);
    formData.append('patientId', user.id);
    await uploadReport(formData);
    fetchReports();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Upload/View Reports</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded Reports:</h3>
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r._id}>
              <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                Report {new Date(r.uploadedAt).toLocaleDateString()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
