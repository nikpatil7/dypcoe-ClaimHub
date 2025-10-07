const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Guard = require('../models/Guard');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '7d' });
};

// @desc    Authenticate guard & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const email = (req.body.email || '').toString().toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const guard = await Guard.findOne({ email });
    if (!guard) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, guard.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (guard.isActive === false) {
      return res.status(403).json({ success: false, message: 'Access revoked' });
    }

    const token = generateToken(guard._id);

    res.json({
      success: true,
      token,
      guard: {
        id: guard._id,
        email: guard.email,
        name: guard.name,
        role: guard.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Get current guard
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const guard = await Guard.findById(req.guard.id).select('-password');
    if (!guard) return res.status(404).json({ success: false, message: 'Guard not found' });
    res.json({ success: true, data: guard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};