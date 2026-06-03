const User = require('../database/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ---
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent users from creating admin accounts
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // If the role is 'doctor', set status to 'pending', otherwise 'active'
    const initialStatus = role === 'doctor' ? 'pending' : 'active';

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      status: initialStatus, // Set status on creation
    });
    await user.save();

    // Don't issue a token for pending doctors; signal to frontend to ask for more details
    if (role === 'doctor') {
        return res.status(201).json({ 
            success: true,
            message: 'Registration successful! Please complete your profile for verification.',
            requiresDetails: true, // Signal to frontend to redirect
            userId: user.id
        });
    }

    // For patients, create token and log them in
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userPayload = { _id: user._id, name: user.name, email: user.email, role: user.role };

    res.status(201).json({ message: 'User registered successfully!', token, user: userPayload });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Check doctor's status before allowing login
    if (user.role === 'doctor') {
        if (user.status === 'pending') {
            return res.status(403).json({ message: 'Your application is pending approval. Please check back later.' });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Your application has been rejected. Please contact support.' });
        }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    
    const userPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };

    res.json({ user: userPayload, token });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  res.send('Forgot password logic here');
};

// --- RESET PASSWORD ---
const resetPassword = async (req, res) => {
  res.send('Reset password logic here');
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

