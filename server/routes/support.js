const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const SupportRequest = require('../models/SupportRequest'); // Assuming your Mongoose model is here

// --- Step 1: Set up environment variables ---
// Install dotenv: npm install dotenv
// Create a file named .env in the root of your server project
// Add your credentials to the .env file like this:
// GMAIL_USER=your-email@gmail.com
// GMAIL_APP_PASS=your16digitapppassword
require('dotenv').config();


// --- Step 2: Create the transporter ONCE ---
// Use the environment variables. This transporter object will be reused.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use the App Password here
  }
});


// --- Step 3: Refine the Route Handler ---
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('📥 Incoming Support Data:', req.body);

    if (!name || !email || !message) {
      // Send a specific error message back to the frontend
      return res.status(400).json({ success: false, error: 'All fields are required. Please fill out the entire form.' });
    }

    // --- Database Operation ---
    // This part remains the same. If it fails, the catch block will handle it.
    const newRequest = new SupportRequest({ name, email, message });
    await newRequest.save();
    console.log('✅ Support request saved to MongoDB');

    // --- Email Sending Operation ---
    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`, // Recommended format
      to: 'support@docify.com', // The address that receives the support emails
      replyTo: email, // So you can reply directly to the user
      subject: `New Support Request from ${name}`,
      text: `You have a new support request from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p>You have a new support request from:</p>
             <ul>
               <li><strong>Name:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
             </ul>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    };

    // Use the single transporter created above
    await transporter.sendMail(mailOptions);
    console.log('✉️ Support email sent successfully');

    // Send success response
    res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    // Log the full error for debugging
    console.error('❌ ERROR in support route:', err);

    // Differentiate between database and email errors if possible
    if (err.code === 'EAUTH' || err.responseCode === 535) {
        return res.status(500).json({ success: false, error: 'Email authentication failed. Check server credentials.' });
    }

    // Generic server error for other issues (like DB connection)
    res.status(500).json({ success: false, error: 'An internal server error occurred.' });
  }
});

module.exports = router;
