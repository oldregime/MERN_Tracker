const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const budgetController = require('../controllers/budgetController');

// Get budget progress
router.get('/progress', protect, budgetController.getBudgetProgress);

// Get all budgets
router.get('/', protect, budgetController.getBudgets);

// Get single budget
router.get('/:id', protect, budgetController.getBudget);

// Create budget
router.post(
  '/',
  [
    protect,
    check('name', 'Name is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0 }),
    check('category', 'Category is required').not().isEmpty(),
    check('period', 'Period is required').not().isEmpty(),
    check('startDate', 'Start date is required').isISO8601().toDate(),
    check('endDate', 'End date is required').isISO8601().toDate()
  ],
  budgetController.createBudget
);

// Update budget
router.put(
  '/:id',
  [
    protect,
    check('name').optional().not().isEmpty(),
    check('amount', 'Amount must be a positive number').optional().isFloat({ min: 0 }),
    check('category').optional().not().isEmpty(),
    check('period').optional().not().isEmpty(),
    check('startDate').optional().isISO8601().toDate(),
    check('endDate').optional().isISO8601().toDate()
  ],
  budgetController.updateBudget
);

// Delete budget
router.delete('/:id', protect, budgetController.deleteBudget);

module.exports = router;