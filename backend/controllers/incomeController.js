const Income = require('../models/Income');
const { validationResult } = require('express-validator');

// @desc    Get all income entries for a user
// @route   GET /api/income
// @access  Private
exports.getIncomes = async (req, res) => {
  try {
    // Add query parameters for filtering
    const query = { user: req.user.id };
    
    // Filter by source if provided
    if (req.query.source) {
      query.source = req.query.source;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.date = { $lte: new Date(req.query.endDate) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Get income entries with pagination
    const incomes = await Income.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Income.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: incomes.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: incomes
    });
  } catch (error) {
    console.error('Get incomes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single income entry
// @route   GET /api/income/:id
// @access  Private
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income entry not found'
      });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this income entry'
      });
    }
    
    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create a new income entry
// @route   POST /api/income
// @access  Private
exports.createIncome = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    // Create new income with user ID
    const income = new Income({
      ...req.body,
      user: req.user.id
    });
    
    // Save to database
    await income.save();
    
    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update an income entry
// @route   PUT /api/income/:id
// @access  Private
exports.updateIncome = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    let income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income entry not found'
      });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this income entry'
      });
    }
    
    // Update income
    income = await Income.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    console.error('Update income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete an income entry
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income entry not found'
      });
    }
    
    // Check if income belongs to user
    if (income.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this income entry'
      });
    }
    
    await income.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get income statistics
// @route   GET /api/income/stats
// @access  Private
exports.getIncomeStats = async (req, res) => {
  try {
    // Get total income by source
    const sourceStats = await Income.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$source', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    
    // Get monthly income
    const monthlyStats = await Income.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: { 
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    // Get total income
    const totalIncome = await Income.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        sourceStats,
        monthlyStats,
        total: totalIncome.length > 0 ? totalIncome[0].total : 0
      }
    });
  } catch (error) {
    console.error('Get income stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getIncomes: exports.getIncomes,
  getIncome: exports.getIncome,
  createIncome: exports.createIncome,
  updateIncome: exports.updateIncome,
  deleteIncome: exports.deleteIncome,
  getIncomeStats: exports.getIncomeStats
};
