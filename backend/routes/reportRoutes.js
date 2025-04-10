const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// Get financial summary
router.get('/summary', protect, reportController.getFinancialSummary);

// Get cash flow data
router.get('/cashflow', protect, reportController.getCashFlow);

// Get expense trends
router.get('/expense-trends', protect, reportController.getExpenseTrends);

module.exports = router;