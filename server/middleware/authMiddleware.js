const jwt = require('jsonwebtoken');
const Guard = require('../models/Guard');
const config = require('../config/config');
const asyncHandler = require('express-async-handler');

// Protect routes - middleware to verify token and set guard on request
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from Bearer format
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get guard from the token
    req.guard = await Guard.findById(decoded.id).select('-password');

    if (!req.guard) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
};

// Role authorization
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403);
      throw new Error(`Not authorized as ${role}`);
    }
  };
};

module.exports = { protect, authorize };