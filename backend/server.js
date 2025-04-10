const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Add a simple welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Personal Finance Tracker API' });
});

// Use routes - all routes are protected with authentication middleware
// that ensures each user can only access their own data
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); // User-specific expenses
app.use('/api/income', incomeRoutes);    // User-specific income
app.use('/api/budgets', budgetRoutes);   // User-specific budgets
app.use('/api/reports', reportRoutes);   // User-specific reports

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

