const express = require('express');
const router = express.Router();
const User = require('../database/User');

router.get('/', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password'); // Exclude password
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
