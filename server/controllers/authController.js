const jwt = require('jsonwebtoken');
const Guard = require('../models/Guard');
const config = require('../config/config');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '7d',
  });
};

// @desc    Authenticate guard & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for username and password
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password' 
      });
    }

    // Find the guard by username
    const guard = await Guard.findOne({ username });

    if (!guard) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if password matches
    const isMatch = await guard.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // If credentials are valid, generate a token
    const token = generateToken(guard._id);

    res.json({
      success: true,
      token,
      guard: {
        id: guard._id,
        username: guard.username,
        role: guard.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get current guard
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const guard = await Guard.findById(req.guard.id).select('-password');
    
    if (!guard) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guard not found' 
      });
    }

    res.json({
      success: true,
      data: guard
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};