const express = require('express');
const router = express.Router();
router.use('/api/auth', require('./authRoutes'));
router.use('/api/items', require('./itemRoutes'));
router.use('/api/contact', require('./contactRoutes'));

module.exports = router;