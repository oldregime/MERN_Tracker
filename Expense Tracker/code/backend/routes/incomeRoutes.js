const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const incomeController = require('../controllers/incomeController');

// Get income statistics
router.get('/stats', protect, incomeController.getIncomeStats);

// Get all income entries
router.get('/', protect, incomeController.getIncomes);

// Get single income entry
router.get('/:id', protect, incomeController.getIncome);

// Create income entry
router.post(
  '/',
  [
    protect,
    check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
    check('description', 'Description is required').not().isEmpty(),
    check('source', 'Source is required').not().isEmpty(),
    check('date', 'Date is required').optional().isISO8601().toDate()
  ],
  incomeController.createIncome
);

// Update income entry
router.put(
  '/:id',
  [
    protect,
    check('amount', 'Amount must be a positive number').optional().isFloat({ min: 0.01 }),
    check('description').optional().not().isEmpty(),
    check('source').optional().not().isEmpty(),
    check('date').optional().isISO8601().toDate()
  ],
  incomeController.updateIncome
);

// Delete income entry
router.delete('/:id', protect, incomeController.deleteIncome);

module.exports = router;