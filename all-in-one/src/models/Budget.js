const mongoose = require('mongoose');

/**
 * Budget Schema
 * Represents a budget allocation for a user, either total monthly budget
 * or category-specific budget
 */
const budgetSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true,
    description: 'References User.id'
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  type: {
    type: String,
    required: true,
    enum: ['total', 'category'],
    lowercase: true,
    description: 'Budget type: total monthly or category-specific'
  },
  category: {
    type: String,
    required: function() {
      return this.type === 'category';
    },
    enum: [
      // Expense categories
      'food', 'health', 'housing', 'sports', 'education'
    ],
    lowercase: true,
    description: 'Category for category-specific budgets (required if type is category)'
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Budget amount must be a positive number']
  },
  currency: {
    type: String,
    enum: ['ILS', 'USD', 'EUR'],
    default: 'ILS'
  }
}, { timestamps: true });

// Compound index for efficient queries and uniqueness
budgetSchema.index(
  { userid: 1, year: 1, month: 1, type: 1, category: 1 },
  { unique: true, sparse: true }
);

// Index for total budgets (category will be null)
budgetSchema.index(
  { userid: 1, year: 1, month: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: 'total' } }
);

module.exports = mongoose.model('Budget', budgetSchema);



