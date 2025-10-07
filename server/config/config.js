require('dotenv').config();

// Configuration settings for the application
module.exports = {
  // MongoDB connection URI
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/lostandfound',
  
  // JWT Secret for signing tokens
  jwtSecret: process.env.JWT_SECRET,
  
  // Port for the server
  port: process.env.PORT || 5000,
  
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
  JWT_EXPIRE: '8h',
  // Hardcoded guard credentials (in production, store hashed password)
  GUARD_CREDENTIALS: {
    email: process.env.GUARD_EMAIL || 'guard@dypcoe.edu',
    password: process.env.GUARD_PASSWORD || 'Guard@123'
  },
  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME || 'DYPCOE Lost & Found',
  
  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};