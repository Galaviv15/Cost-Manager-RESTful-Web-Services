const mongoose = require('mongoose');

/**
 * Cost Schema
 * Represents an expense/cost entry
 */
const costSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'health', 'housing', 'sports', 'education'],
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
    min: [0, 'Cost sum must be a positive number']
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Cost', costSchema);
