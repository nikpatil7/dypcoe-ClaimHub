const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('./config/config');

dotenv.config();

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// const app = express();


const PORT = config.port || 5000;

module.exports = app;