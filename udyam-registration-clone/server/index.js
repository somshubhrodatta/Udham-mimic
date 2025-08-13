const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Basic API routes
app.post('/api/generate-otp', (req, res) => {
  const { aadhaar, mobile } = req.body;
  
  // Basic validation
  if (!aadhaar || !mobile) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar and mobile are required'
    });
  }
  
  // Simulate OTP generation
  res.json({
    success: true,
    message: 'OTP sent successfully',
    data: {
      mobile: mobile.replace(/(\d{6})(\d{4})/, '$1****')
    }
  });
});

app.post('/api/verify-otp', (req, res) => {
  const { aadhaar, mobile, otp } = req.body;
  
  if (otp === '123456') {
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        aadhaarVerified: true,
        mobileVerified: true
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid OTP. Use 123456 for demo.'
    });
  }
});

app.post('/api/verify-pan', (req, res) => {
  const { aadhaar, pan, name, dateOfBirth } = req.body;
  
  // Simulate PAN verification
  res.json({
    success: true,
    message: 'PAN verified successfully',
    data: {
      panVerified: true,
      nameMatch: true,
      dobMatch: true
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
