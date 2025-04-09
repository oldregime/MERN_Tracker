const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Housing', 'Transportation', 'Food', 'Utilities', 
      'Insurance', 'Healthcare', 'Debt', 'Personal', 
      'Entertainment', 'Education', 'Clothing', 'Gifts',
      'Savings', 'Investments', 'Taxes', 'Other'
    ]
  },
  period: {
    type: String,
    required: [true, 'Budget period is required'],
    enum: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    default: 'Monthly'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: function() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    default: function() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rollover: {
    type: Boolean,
    default: false,
    description: 'Whether unused budget rolls over to next period'
  },
  rolloverAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3498db' // Default color for UI representation
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating spent amount (will be populated when queried)
BudgetSchema.virtual('spent').get(function() {
  return this._spent || 0;
});

BudgetSchema.virtual('remaining').get(function() {
  return (this.amount + this.rolloverAmount) - (this._spent || 0);
});

BudgetSchema.virtual('percentUsed').get(function() {
  if (this.amount + this.rolloverAmount === 0) return 0;
  return Math.min(100, Math.round((this._spent || 0) / (this.amount + this.rolloverAmount) * 100));
});

// Index for faster queries
BudgetSchema.index({ user: 1, period: 1, category: 1 });
BudgetSchema.index({ user: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);
