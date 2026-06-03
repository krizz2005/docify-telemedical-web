const User = require("../database/User");
const Appointment = require("../database/Appointment");
const Report = require("../database/Report");
const SupportTicket = require("../database/SupportTicket");
// ADD THIS: Make sure the path to your Subscription model is correct
const Subscription = require("../database/Subscription");


/* ===============================
    🔹 Doctor Approval Management
    =============================== */

// --- Get All Doctors Pending Approval ---
exports.getPendingDoctors = async (req, res) => {
     try {
         // NOTE: Your model uses the User collection for doctors, which is correct.
         const pendingDoctors = await User.find({ role: 'doctor', status: 'pending' });
         res.json(pendingDoctors);
     } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
     }
};

// --- Update a Doctor's Status (Approve/Reject) ---
exports.updateDoctorStatus = async (req, res) => {
     try {
         const { doctorId, status } = req.body; // status should be 'active' or 'rejected'

         if (!['active', 'rejected'].includes(status)) {
             return res.status(400).json({ message: 'Invalid status provided.' });
         }

         const doctor = await User.findById(doctorId);

         if (!doctor || doctor.role !== 'doctor') {
             return res.status(404).json({ message: 'Doctor not found.' });
         }

         doctor.status = status;
         await doctor.save();

         res.json({ message: `Doctor has been ${status === 'active' ? 'approved' : 'rejected'}.` });

     } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
     }
};

// --- Doctor Submits Additional Details ---
exports.submitDoctorDetails = async (req, res) => {
     try {
         const { userId, specialization, qualifications, clinicAddress } = req.body;
         
         const doctor = await User.findById(userId);

         if (!doctor || doctor.role !== 'doctor') {
             return res.status(404).json({ message: 'Doctor not found.' });
         }

         // Add details to the user document
         doctor.specialization = specialization;
         doctor.qualifications = qualifications;
         doctor.clinicAddress = clinicAddress;

         await doctor.save();

         res.status(200).json({ message: 'Your details have been submitted for review.' });
         
     } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
     }
};


/* ===============================
    🔹 User Management
    =============================== */
exports.getAllUsers = async (req, res) => {
   try {
     const users = await User.find().select("-password");
     res.json(users);
   } catch (err) {
     res.status(500).json({ error: "Failed to fetch users" });
   }
};

exports.getAllDoctors = async (req, res) => {
   try {
     const doctors = await User.find({ role: "doctor" }).select("-password");
     res.json(doctors);
   } catch (err) {
     res.status(500).json({ error: "Failed to fetch doctors" });
   }
};

exports.getAllPatients = async (req, res) => {
   try {
     const patients = await User.find({ role: "patient" }).select("-password");
     res.json(patients);
   } catch (err) {
     res.status(500).json({ error: "Failed to fetch patients" });
   }
};

exports.deleteUser = async (req, res) => {
  try {
    // ✅ CRITICAL LINE: Ensure you are using req.params.id to match the route
    const userIdToDelete = req.params.id;

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optional but recommended: clean up associated data
    if (user.role === 'doctor' || user.role === 'patient') {
      await Appointment.deleteMany({ 
        $or: [{ doctor: userIdToDelete }, { patient: userIdToDelete }],
        date: { $gte: new Date() } 
      });
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.json({ message: "User and associated data deleted successfully" });

  } catch (err) {
    console.error("Error during user deletion:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
/* ===============================
    🔹 Doctor Management (Edit profile)
    =============================== */
exports.updateDoctorProfile = async (req, res) => {
   try {
     const { specialization, consultationFee, clinicLocation } = req.body;
     const doctor = await User.findByIdAndUpdate(
       req.params.doctorId,
       { specialization, consultationFee, clinicLocation },
       { new: true, runValidators: true }
     ).select("-password");

     if (!doctor) return res.status(404).json({ error: "Doctor not found" });

     res.json(doctor);
   } catch (err) {
     res.status(400).json({ error: "Failed to update doctor details" });
   }
};

/* ===============================
    🔹 Patient Management
    =============================== */
exports.updatePatientSubscription = async (req, res) => {
   try {
     const { subscription } = req.body;
     const patient = await User.findByIdAndUpdate(
       req.params.patientId,
       { subscription },
       { new: true, runValidators: true }
     ).select("-password");

     if (!patient) return res.status(404).json({ error: "Patient not found" });

     res.json(patient);
   } catch (err) {
     res.status(400).json({ error: "Failed to update patient subscription" });
   }
};

/* ===============================
    🔹 Support Ticket Management
    =============================== */
exports.getSupportTickets = async (req, res) => {
   try {
     const tickets = await SupportTicket.find()
       .populate("user", "name email role")
       .sort({ createdAt: -1 }); // Changed from submittedAt to createdAt for consistency

     res.json(tickets);
   } catch (err) {
     console.error("Error fetching support tickets:", err);
     res.status(500).json({ error: "Failed to fetch support tickets" });
   }
};

exports.updateTicketStatus = async (req, res) => {
   try {
     const { status } = req.body;
     const ticket = await SupportTicket.findByIdAndUpdate(
       req.params.id,
       { status },
       { new: true }
     );

     if (!ticket) return res.status(404).json({ error: "Ticket not found" });

     res.json(ticket);
   } catch (err) {
     res.status(500).json({ error: "Failed to update ticket" });
   }
};


/* ===============================
    🔹 Dashboard Stats (REPLACED)
    =============================== */
// Helper function to get the start and end of a given month
const getMonthDateRange = (year, month) => {
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
};

// Helper function to calculate percentage trend
const calculateTrend = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? 100 : 0; // If previous was 0, any increase is a 100% increase
    }
    const trend = ((current - previous) / previous) * 100;
    return parseFloat(trend.toFixed(2)); // Return trend with 2 decimal places
};

exports.getStats = async (req, res) => {
    try {
        const now = new Date();
        const currentMonthIndex = now.getMonth();
        const currentYear = now.getFullYear();

        // --- 1. CALCULATE KPI CARD STATS ---
        const { startDate: startOfCurrentMonth, endDate: endOfCurrentMonth } = getMonthDateRange(currentYear, currentMonthIndex);
        const { startDate: startOfLastMonth, endDate: endOfLastMonth } = getMonthDateRange(currentYear, currentMonthIndex - 1);
        
        // --- Revenue Calculation ---
        const currentAppointmentRevenue = await Appointment.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
            { $group: { _id: null, total: { $sum: '$consultationFee' } } }
        ]);
        const currentSubscriptionRevenue = await Subscription.aggregate([
            { $match: { createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
            { $group: { _id: null, total: { $sum: '$price' } } } // Assumes Subscription model has a 'price' field
        ]);
        const totalCurrentMonthRevenue = (currentAppointmentRevenue[0]?.total || 0) + (currentSubscriptionRevenue[0]?.total || 0);

        const lastAppointmentRevenue = await Appointment.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$consultationFee' } } }
        ]);
        const lastSubscriptionRevenue = await Subscription.aggregate([
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalLastMonthRevenue = (lastAppointmentRevenue[0]?.total || 0) + (lastSubscriptionRevenue[0]?.total || 0);

        const revenueTrend = calculateTrend(totalCurrentMonthRevenue, totalLastMonthRevenue);

        // --- Other KPIs ---
        const totalPatients = await User.countDocuments({ role: "patient" });
        const totalDoctors = await User.countDocuments({ role: "doctor" });
        const appointmentsThisMonth = await Appointment.countDocuments({ createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } });
        
        // --- 2. GENERATE DATA FOR CHARTS (LAST 6 MONTHS) ---
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = [];
        const userGrowthData = [];

        for (let i = 5; i >= 0; i--) {
            let month = currentMonthIndex - i;
            let year = currentYear;
            if (month < 0) {
                month += 12;
                year -= 1;
            }

            const { startDate, endDate } = getMonthDateRange(year, month);
            
            // Revenue for the chart month
            const monthApptRevenue = await Appointment.aggregate([
                { $match: { status: 'completed', createdAt: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: null, total: { $sum: '$consultationFee' } } }
            ]);
            const monthSubRevenue = await Subscription.aggregate([
                { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]);
            revenueData.push({ month: months[month], revenue: (monthApptRevenue[0]?.total || 0) + (monthSubRevenue[0]?.total || 0) });
            
            // User growth for the chart month
            const newPatients = await User.countDocuments({ role: 'patient', createdAt: { $gte: startDate, $lte: endDate } });
            const newDoctors = await User.countDocuments({ role: 'doctor', createdAt: { $gte: startDate, $lte: endDate } });
            userGrowthData.push({ month: months[month], patients: newPatients, doctors: newDoctors });
        }

        // --- 3. FETCH ACTIONABLE LISTS ---
        const pendingDoctors = await User.find({ role: 'doctor', status: 'pending' }).limit(5);
        const supportTickets = await SupportTicket.find({ status: 'open' }).sort({ createdAt: -1 }).limit(5).populate("user", "name email");

        // --- 4. ASSEMBLE FINAL RESPONSE OBJECT ---
        res.status(200).json({
            stats: {
                totalPatients: { value: totalPatients, trend: 0 }, // Placeholder for patient trend
                totalDoctors: { value: totalDoctors, trend: 0 }, // Placeholder for doctor trend
                totalAppointments: { value: appointmentsThisMonth, trend: 0 }, // Placeholder for appointment trend
                monthlyRevenue: { value: totalCurrentMonthRevenue, trend: revenueTrend },
            },
            revenueData,
            userGrowthData,
            pendingDoctors,
            supportTickets,
        });

    } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};


/* ===============================
    🔹 Subscription Tracking
    =============================== */
exports.getSubscriptions = async (req, res) => {
   try {
     // This endpoint should ideally fetch from a dedicated Subscriptions collection
     const subscriptions = await Subscription.find().populate('patientId', 'name email').sort({ endDate: -1 });
     res.json(subscriptions);
   } catch (err) {
     res.status(500).json({ error: "Failed to fetch subscriptions" });
   }
};