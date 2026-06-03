// File: server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// ✅ Test Route
router.get('/', (req, res) => {
  res.send('Auth API working');
});

// ✅ Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
