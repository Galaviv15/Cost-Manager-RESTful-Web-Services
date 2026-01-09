const mongoose = require('mongoose');

/**
 * Transaction Schema
 * Represents a unified income/expense transaction entry
 * Replaces the Cost model with support for both income and expenses
 */
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    lowercase: true,
    description: 'Type of transaction: income or expense'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Expense categories
      'food', 'health', 'housing', 'sports', 'education',
      // Income categories
      'salary', 'freelance', 'investment', 'business', 'gift', 'other'
    ],
    lowercase: true
  },
  userid: {
    type: Number,
    required: true,
    description: 'References User.id'
  },
  sum: {
    type: Number,
    required: true,
    min: [0, 'Transaction sum must be a positive number']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  currency: {
    type: String,
    enum: ['ILS', 'USD', 'EUR'],
    default: 'ILS'
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'cash', 'bit', 'check'],
    lowercase: true
  },
  tags: {
    type: [String],
    default: [],
    description: 'Optional tags for categorization and filtering'
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      lowercase: true
    },
    next_date: {
      type: Date,
      description: 'Next occurrence date for recurring transactions'
    }
  }
}, { timestamps: true });

// Index for efficient queries
transactionSchema.index({ userid: 1, type: 1, created_at: -1 });
transactionSchema.index({ userid: 1, category: 1 });
transactionSchema.index({ userid: 1, 'recurring.enabled': 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

