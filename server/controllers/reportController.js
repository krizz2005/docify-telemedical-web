const Report = require('../database/Report');
const Appointment = require('../database/Appointment');
const mongoose = require('mongoose');
const path = require('path');

// ------------------ UPLOAD REPORT ------------------
const uploadReport = async (req, res) => {
  try {
    const { title, doctorId, patientId } = req.body;
    const uploader = req.user; // from auth middleware

    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }
    if (!title) {
      return res.status(400).json({ error: "A title is required for the report." });
    }

    let finalPatientId;
    let finalDoctorId;

    if (uploader.role === "patient") {
      // Patient uploads
      finalPatientId = uploader.id;
      finalDoctorId = doctorId || null;
    } else if (uploader.role === "doctor") {
      // Doctor uploads
      if (!patientId) {
        return res.status(400).json({ error: "Patient ID is required when doctor uploads report" });
      }
      finalPatientId = patientId;
      finalDoctorId = uploader.id;
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const newReport = new Report({
      patientId: finalPatientId,
      doctorId: finalDoctorId,
      title,
      fileUrl,
      uploadedBy: uploader.id,
    });

    await newReport.save();
    res.status(201).json({ message: "Report uploaded successfully!", report: newReport });
  } catch (err) {
    console.error("Error uploading report:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// ------------------ GET REPORTS FOR PATIENT ------------------
const getReportsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: "Invalid patient ID format." });
    }

    // Access control
    if (req.user.role === "doctor") {
      const hasAppointment = await Appointment.findOne({ patientId, doctorId: req.user.id });
      if (!hasAppointment) {
        return res.status(403).json({ error: "Access denied." });
      }
    } else if (req.user.id !== patientId) {
      return res.status(403).json({ error: "Access denied. You can only view your own reports." });
    }

    const reports = await Report.find({ patientId })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// ------------------ DOWNLOAD REPORT ------------------
const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Permission check
    if (
      (req.user.role === "patient" && report.patientId.toString() !== req.user.id) ||
      (req.user.role === "doctor" && report.doctorId?.toString() !== req.user.id)
    ) {
      return res.status(403).json({ error: "Not authorized to download this file" });
    }

    const filePath = path.join(__dirname, "..", "public", report.fileUrl.replace(/^\/+/, ""));
    res.download(filePath, `${report.title}${path.extname(filePath)}`);
  } catch (err) {
    console.error("Error downloading report:", err.message);
    res.status(500).json({ error: "Server error while downloading report" });
  }
};

module.exports = {
  uploadReport,
  getReportsByPatientId,
  downloadReport,
};
