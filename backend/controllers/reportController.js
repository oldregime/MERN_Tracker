const Expense = require('../models/Expense');
const Income = require('../models/Income');
const mongoose = require('mongoose');

// @desc    Get financial summary
// @route   GET /api/reports/summary
// @access  Private
exports.getFinancialSummary = async (req, res) => {
  try {
    // Get date range from query params or default to current month
    let startDate, endDate;

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else if (req.query.period === 'year') {
      // Current year
      const now = new Date();
      startDate = new Date(now.getFullYear(), 0, 1); // Jan 1
      endDate = new Date(now.getFullYear(), 11, 31); // Dec 31
    } else if (req.query.period === 'quarter') {
      // Current quarter
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get total expenses - ensure we only get data for the current user
    const expenseTotal = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get total income - ensure we only get data for the current user
    const incomeTotal = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get expenses by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Get income by source
    const incomeBySource = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Calculate balance and savings rate
    const totalExpenses = expenseTotal.length > 0 ? expenseTotal[0].total : 0;
    const totalIncome = incomeTotal.length > 0 ? incomeTotal[0].total : 0;
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        period: {
          startDate,
          endDate
        },
        summary: {
          totalIncome,
          totalExpenses,
          balance,
          savingsRate: parseFloat(savingsRate.toFixed(2))
        },
        expensesByCategory,
        incomeBySource
      }
    });
  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get cash flow data
// @route   GET /api/reports/cashflow
// @access  Private
exports.getCashFlow = async (req, res) => {
  try {
    // Get date range from query params or default to last 12 months
    let startDate, endDate;
    const now = new Date();

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
      // Default to last 12 months
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get monthly expenses
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get monthly income
    const monthlyIncome = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format data for chart
    const months = [];
    const expenseData = [];
    const incomeData = [];
    const balanceData = [];

    // Create array of all months in range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Format month name
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
      months.push(`${monthName} ${year}`);

      // Find expense for this month
      const expense = monthlyExpenses.find(
        e => e._id.year === year && e._id.month === month
      );
      const expenseAmount = expense ? expense.total : 0;
      expenseData.push(expenseAmount);

      // Find income for this month
      const income = monthlyIncome.find(
        i => i._id.year === year && i._id.month === month
      );
      const incomeAmount = income ? income.total : 0;
      incomeData.push(incomeAmount);

      // Calculate balance
      balanceData.push(incomeAmount - expenseAmount);

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    res.status(200).json({
      success: true,
      data: {
        labels: months,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: 'rgba(46, 204, 113, 0.5)',
            borderColor: 'rgb(46, 204, 113)',
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: 'rgba(231, 76, 60, 0.5)',
            borderColor: 'rgb(231, 76, 60)',
            borderWidth: 1
          },
          {
            label: 'Balance',
            data: balanceData,
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            borderColor: 'rgb(52, 152, 219)',
            borderWidth: 1,
            hidden: true
          }
        ]
      }
    });
  } catch (error) {
    console.error('Get cash flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get expense trends
// @route   GET /api/reports/expense-trends
// @access  Private
exports.getExpenseTrends = async (req, res) => {
  try {
    // Get date range from query params or default to last 6 months
    let startDate, endDate;
    const now = new Date();

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
      // Default to last 6 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get expenses by category and month
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.category': 1 }
      }
    ]);

    // Get all categories
    const categoriesResult = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id.toString()),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category'
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const categories = categoriesResult.map(c => c._id);

    // Format data for chart
    const months = [];
    const datasets = {};

    // Initialize datasets for each category
    categories.forEach(category => {
      datasets[category] = [];
    });

    // Create array of all months in range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Format month name
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
      months.push(`${monthName} ${year}`);

      // Add expense data for each category
      categories.forEach(category => {
        const expense = expensesByCategory.find(
          e => e._id.year === year && e._id.month === month && e._id.category === category
        );
        datasets[category].push(expense ? expense.total : 0);
      });

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Convert datasets object to array format for Chart.js
    const datasetArray = categories.map((category, index) => {
      // Generate a color based on index
      const colors = [
        'rgba(52, 152, 219, 0.5)', // blue
        'rgba(46, 204, 113, 0.5)', // green
        'rgba(231, 76, 60, 0.5)',  // red
        'rgba(241, 196, 15, 0.5)', // yellow
        'rgba(155, 89, 182, 0.5)', // purple
        'rgba(26, 188, 156, 0.5)', // turquoise
        'rgba(211, 84, 0, 0.5)',   // orange
        'rgba(52, 73, 94, 0.5)'    // dark blue
      ];

      return {
        label: category,
        data: datasets[category],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.5', '1'),
        borderWidth: 1
      };
    });

    res.status(200).json({
      success: true,
      data: {
        labels: months,
        categories,
        datasets: datasetArray
      }
    });
  } catch (error) {
    console.error('Get expense trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getFinancialSummary: exports.getFinancialSummary,
  getCashFlow: exports.getCashFlow,
  getExpenseTrends: exports.getExpenseTrends
};
