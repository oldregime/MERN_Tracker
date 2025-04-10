const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const expenseController = require('../controllers/expenseController');

// Get expense statistics
router.get('/stats', protect, expenseController.getExpenseStats);

// Get all expenses
router.get('/', protect, expenseController.getExpenses);

// Get single expense
router.get('/:id', protect, expenseController.getExpense);

// Create expense
router.post(
  '/',
  [
    protect,
    check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Date is required').optional().isISO8601().toDate()
  ],
  expenseController.createExpense
);

// Update expense
router.put(
  '/:id',
  [
    protect,
    check('amount', 'Amount must be a positive number').optional().isFloat({ min: 0.01 }),
    check('description').optional().not().isEmpty(),
    check('category').optional().not().isEmpty(),
    check('date').optional().isISO8601().toDate()
  ],
  expenseController.updateExpense
);

// Delete expense
router.delete('/:id', protect, expenseController.deleteExpense);

module.exports = router;