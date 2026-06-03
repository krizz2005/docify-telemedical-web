const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadReport, getReportsByPatientId, downloadReport } = require("../controllers/reportController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const Report = require("../database/Report");

// ------------------ MULTER CONFIG ------------------
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ------------------ ROUTES ------------------

// Get reports of logged-in patient
router.get("/my-reports", authenticateJWT, async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user.id })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching my reports:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Upload new report (doctor or patient)
router.post("/", authenticateJWT, upload.single("reportFile"), uploadReport);

// Get reports for a specific patient (doctor use-case)
router.get("/:patientId", authenticateJWT, getReportsByPatientId);

// Download report by ID
router.get("/download/:id", authenticateJWT, downloadReport);

module.exports = router;
