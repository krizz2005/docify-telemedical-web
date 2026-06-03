const User = require('../database/User');
const Appointment = require('../database/Appointment');

// Get all appointments for the logged-in doctor
exports.getAppointmentsForDoctor = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name email')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error("Error fetching doctor's appointments:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update the status of an appointment
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (err) {
        console.error("Error updating appointment status:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a list of all users with the 'doctor' role
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error("Error fetching all doctors:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a list of all unique patients for the logged-in doctor
exports.getMyPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name email profileImage');
        
        const patients = appointments.map(app => app.patientId).filter(p => p);
        const uniquePatients = Array.from(new Map(patients.map(p => [p._id.toString(), p])).values());

        res.json(uniquePatients);
    } catch (err) {
        console.error("Error fetching doctor's patients:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Handle the profile image upload for a doctor
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const doctor = await User.findById(req.params.id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ error: 'Doctor not found.' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        doctor.profileImage = imageUrl;
        await doctor.save();

        res.status(200).json({
            message: 'Image uploaded successfully!',
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error('Error during profile image upload:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a doctor's own profile details
exports.updateDoctorProfile = async (req, res) => {
    try {
        const { specialization, qualifications, consultationFee, clinicLocation } = req.body;
        
        const doctor = await User.findById(req.user.id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: "Doctor not found." });
        }

        doctor.specialization = specialization || doctor.specialization;
        doctor.qualifications = qualifications || doctor.qualifications;
        doctor.consultationFee = consultationFee || doctor.consultationFee;
        doctor.clinicLocation = clinicLocation || doctor.clinicLocation;
        
        const updatedDoctor = await doctor.save();
        
        const userPayload = {
             _id: updatedDoctor._id,
             name: updatedDoctor.name,
             email: updatedDoctor.email,
             role: updatedDoctor.role,
             specialization: updatedDoctor.specialization,
             qualifications: updatedDoctor.qualifications,
             consultationFee: updatedDoctor.consultationFee,
             clinicLocation: updatedDoctor.clinicLocation,
             profileImage: updatedDoctor.profileImage,
        };

        res.json(userPayload);

    } catch (err) {
        console.error("Error updating doctor profile:", err);
        res.status(500).json({ message: "Server error while updating profile." });
    }
};

