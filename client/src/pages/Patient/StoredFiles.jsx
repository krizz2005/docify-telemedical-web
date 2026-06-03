import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { FiUpload, FiDownload, FiFileText, FiXCircle, FiLoader, FiInbox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "https://docify-telemedical-web-1.onrender.com";

// A single item in the list of reports
const ReportItem = ({ report, onDownload }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
    >
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
                <FiFileText className="text-indigo-600" size={20} />
            </div>
            <div>
                <p className="font-semibold text-gray-800">{report.title}</p>
                <p className="text-sm text-gray-500">
                    Uploaded on {new Date(report.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
        <button
  onClick={() => onDownload(report._id, report.title)}
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors duration-200"
>
  <FiDownload size={16} />
  <span>Download</span>
</button>
    </motion.div>
);

// A placeholder shown when there are no reports
const EmptyState = () => (
    <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <FiInbox size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold text-gray-700">No Files Found</h3>
        <p className="mt-1 text-gray-500">Upload your first report to see it here.</p>
    </div>
);

export default function StoredFiles() {
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
console.log("Token being sent:", token); // Add this line
const { data } = await axios.get(
  `${API_BASE_URL}/api/reports/my-reports`,
  { headers: { Authorization: `Bearer ${token}` } }
);

            setReports(data);
        } catch (err) {
            console.error("Error fetching reports:", err);
            setError("Failed to fetch reports. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!title) {
                // Pre-fill title with filename without extension
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };
    
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setError("Please provide both a title and a file.");
            return;
        }
        
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/reports/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data" 
                },
            });
            setFile(null);
            setTitle("");
            document.getElementById('file-input').value = null; // Clear file input
            fetchReports(); // Refresh the list
        } catch (err) {
            console.error("Upload error:", err);
            setError("File upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (id, title) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/api/reports/download/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // important
      }
    );

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.pdf`); // default extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download error:", err);
    setError("Could not download the file.");
  }
};

    return (
        <Layout>
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Stored Files & Reports</h1>

                    {/* --- Upload Form Card --- */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                        <form onSubmit={handleUpload}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload a New File</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">File Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        placeholder="e.g., Annual Health Checkup"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isUploading}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                     <label htmlFor="file-input" className={`w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                                        {file ? 'File Selected' : 'Choose File'}
                                     </label>
                                     <input id="file-input" type="file" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm text-gray-500 w-2/3">
                                    {file ? `Selected: ${file.name}` : "No file chosen"}
                                </p>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 w-1/3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200"
                                    disabled={isUploading || !file || !title}
                                >
                                    {isUploading ? <FiLoader className="animate-spin" /> : <FiUpload />}
                                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- Error Display --- */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 p-4 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-lg"
                                role="alert"
                            >
                                <FiXCircle />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* --- File List Section --- */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">My Reports</h2>
                    {isLoading ? (
                        <div className="text-center p-10">
                            <FiLoader size={32} className="mx-auto animate-spin text-indigo-600" />
                        </div>
                    ) : reports.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {reports.map((report) => (
                                    <ReportItem key={report._id} report={report} onDownload={handleDownload} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
