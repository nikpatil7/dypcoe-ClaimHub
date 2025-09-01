const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const config = require('./config/config');
const { startScheduler } = require('./utils/claimScheduler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware to log request bodies for debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`${req.method} ${req.url} - Request body:`, req.body);
  }
  next();
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static files - serve the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Route Registration
app.use('/', require('./routes')); // Main API routes

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'API working',
    routes: {
      auth: {
        login: 'POST /api/auth/login'
      }
    }
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


//debugging code
// Add before app.listen()
console.log('Registered Routes:');
try {
  if (app._router && app._router.stack) {
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)[0]} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`${Object.keys(handler.route.methods)[0]} /api${handler.route.path}`);
          }
        });
      }
    });
  } else {
    console.log('No routes found or router not initialized yet');
  }
} catch (error) {
  console.error('Error inspecting routes:', error);
}

const PORT = config.port || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;