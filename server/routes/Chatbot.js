const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;

  // Basic logic (replace with AI later)
  let reply = "Sorry, I didn't understand that.";

  if (/appointment|book/i.test(message)) {
    reply = "You can book an appointment from your dashboard.";
  } else if (/report/i.test(message)) {
    reply = "You can upload and view reports in the Reports section.";
  } else if (/doctor/i.test(message)) {
    reply = "Our doctors are listed on the dashboard. You can consult anytime!";
  }

  res.json({ reply });
});

module.exports = router;
