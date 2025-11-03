const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/db');

// Load environment variables
dotenv.config();

// Set default environment variables if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || '5cfea10cc02da694101ed82190c5c01a8272ef26b1e758bf114f9dc2253fdbd2';
process.env.JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '1h';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_change_this_in_production';
process.env.JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('../backend/routes/authRoutes');
const expenseRoutes = require('../backend/routes/expenseRoutes');
const incomeRoutes = require('../backend/routes/incomeRoutes');
const budgetRoutes = require('../backend/routes/budgetRoutes');
const reportRoutes = require('../backend/routes/reportRoutes');

// Add a simple welcome route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Personal Finance Tracker API' });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export for Vercel serverless
module.exports = app;
