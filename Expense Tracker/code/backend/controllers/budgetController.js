const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    // Ensure we're only getting budgets for the current user
    const query = { user: req.user.id };

    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by active status if provided
    if (req.query.isActive) {
      query.isActive = req.query.isActive === 'true';
    }

    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.$or = [
        {
          startDate: {
            $lte: new Date(req.query.endDate)
          },
          endDate: {
            $gte: new Date(req.query.startDate)
          }
        }
      ];
    } else if (req.query.startDate) {
      query.endDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.startDate = { $lte: new Date(req.query.endDate) };
    }

    // Get current budgets by default
    if (!req.query.startDate && !req.query.endDate && !req.query.all) {
      const now = new Date();
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get budgets with pagination
    const budgets = await Budget.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Budget.countDocuments(query);

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateBudgetSpent(budget._id, req.user.id);
        const budgetObj = budget.toObject();
        budgetObj._spent = spent;
        return budgetObj;
      })
    );

    res.status(200).json({
      success: true,
      count: budgets.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: budgetsWithSpent
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this budget'
      });
    }

    // Calculate spent amount
    const spent = await calculateBudgetSpent(budget._id, req.user.id);
    const budgetObj = budget.toObject();
    budgetObj._spent = spent;

    res.status(200).json({
      success: true,
      data: budgetObj
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Create new budget with user ID
    const budget = new Budget({
      ...req.body,
      user: req.user.id
    });

    // Save to database
    await budget.save();

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this budget'
      });
    }

    // Update budget
    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Calculate spent amount
    const spent = await calculateBudgetSpent(budget._id, req.user.id);
    const budgetObj = budget.toObject();
    budgetObj._spent = spent;

    res.status(200).json({
      success: true,
      data: budgetObj
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this budget'
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get budget progress
// @route   GET /api/budgets/progress
// @access  Private
exports.getBudgetProgress = async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Find active budgets for the current period - ensure we only get data for the current user
    const budgets = await Budget.find({
      user: req.user.id,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    // Calculate spent amount for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateBudgetSpent(budget._id, req.user.id);
        const budgetObj = budget.toObject();
        budgetObj._spent = spent;
        return budgetObj;
      })
    );

    res.status(200).json({
      success: true,
      count: budgetsWithProgress.length,
      data: budgetsWithProgress
    });
  } catch (error) {
    console.error('Get budget progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to calculate spent amount for a budget
const calculateBudgetSpent = async (budgetId, userId) => {
  try {
    const budget = await Budget.findById(budgetId);

    // Ensure the budget belongs to the current user for data isolation
    if (!budget || budget.user.toString() !== userId.toString()) {
      return 0;
    }

    // Get expenses for the budget period and category
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          category: budget.category,
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    return expenses.length > 0 ? expenses[0].total : 0;
  } catch (error) {
    console.error('Calculate budget spent error:', error);
    return 0;
  }
};

module.exports = {
  getBudgets: exports.getBudgets,
  getBudget: exports.getBudget,
  createBudget: exports.createBudget,
  updateBudget: exports.updateBudget,
  deleteBudget: exports.deleteBudget,
  getBudgetProgress: exports.getBudgetProgress
};
