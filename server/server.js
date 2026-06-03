import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import chatbotRoutes from './routes/Chatbot.js';
import paymentRoutes from './routes/paymentRoutes.js'

// --- Basic Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Connection ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Static File Serving ---
// Serve files from the 'uploads' directory at the root
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files from the 'public' directory (for general assets)
app.use(express.static(path.join(__dirname, 'public')));


// --- API Routes ---
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use("/api/payments", paymentRoutes);


// --- Server Start ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));