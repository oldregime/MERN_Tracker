const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: [
      'Salary', 'Freelance', 'Business', 'Investments', 
      'Dividends', 'Rental', 'Interest', 'Gifts', 
      'Refunds', 'Sale', 'Other'
    ]
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly', null],
    default: null
  },
  taxable: {
    type: Boolean,
    default: true
  },
  attachment: {
    type: String // URL to uploaded document
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
IncomeSchema.index({ user: 1, date: -1 });
IncomeSchema.index({ user: 1, source: 1 });

module.exports = mongoose.model('Income', IncomeSchema);
