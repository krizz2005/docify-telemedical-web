const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendEmail(to, subject, text) {
  console.log("📤 Attempting to send email...");
  console.log("From:", process.env.EMAIL_USER);
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Text:", text);

  try {
    const info = await transporter.sendMail({
      from: `"Docify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent: ", info.response);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error; // Allow controller to catch and respond with error
  }
};
