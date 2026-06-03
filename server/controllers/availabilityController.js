// File Path: server/controllers/availabilityController.js

const Availability = require('../models/Availability');
const Appointment = require('../database/Appointment');

// Get or create the availability for the logged-in doctor
const getAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne({ doctorId: req.user.id });
    if (!availability) {
      availability = new Availability({ doctorId: req.user.id });
      await availability.save();
    }
    res.json(availability);
  } catch (err) {
    console.error('Error getting availability:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update the availability for the logged-in doctor
const updateAvailability = async (req, res) => {
  try {
    const { schedule } = req.body;
    const availability = await Availability.findOneAndUpdate(
      { doctorId: req.user.id },
      { schedule },
      { new: true, upsert: true }
    );
    res.json(availability);
  } catch (err) {
    console.error('Error updating availability:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// --- THE ALGORITHM ---
// This function calculates available 30-minute slots for a doctor on a specific date.
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ error: 'Doctor ID and date are required.' });
        }

        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

        // 1. Find the doctor's general working hours for that day of the week
        const availability = await Availability.findOne({ doctorId });
        if (!availability) {
            return res.json([]); // Doctor has not set up their schedule
        }

        const daySchedule = availability.schedule.find(d => d.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isAvailable) {
            return res.json([]); // Doctor is not working on this day
        }

        // 2. Find all appointments already booked for that doctor on that specific date
        const existingAppointments = await Appointment.find({
            doctorId,
            date: date,
        });
        const bookedTimes = new Set(existingAppointments.map(appt => appt.time));

        // 3. Generate all possible 30-minute slots and filter out the booked ones
        const availableSlots = [];
        const slotDuration = 30; // Session duration in minutes
        
        // Use a library like `moment.js` or manual parsing for robust time handling
        let currentTime = new Date(`${date}T${daySchedule.startTime}:00`);
        const endTime = new Date(`${date}T${daySchedule.endTime}:00`);

        while (currentTime < endTime) {
            // Format the time to HH:MM (24-hour format)
            const timeString = currentTime.toTimeString().substring(0, 5);
            
            if (!bookedTimes.has(timeString)) {
                availableSlots.push(timeString);
            }
            
            // Increment time by the slot duration
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }

        res.json(availableSlots);

    } catch (err) {
        console.error('Error fetching available slots:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    getAvailability,
    updateAvailability,
    getAvailableSlots,
};
