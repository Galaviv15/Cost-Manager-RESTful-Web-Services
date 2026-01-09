const transactionService = require('../services/transaction.service');
const { validateTransactionType, validateCategory, validateDate, validatePositiveNumber } = require('../utils/validators');
const { logger } = require('../config/logger');

/**
 * Create a new transaction
 */
async function createTransaction(req, res) {
  try {
    const { type, description, category, userid, sum, tags, recurring, created_at, currency, payment_method } = req.body;

    // Validate required fields
    if (!type || !description || !category || (userid === undefined && !req.user) || sum === undefined) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Missing required fields: type, description, category, userid, and sum are required' 
      });
    }

    // Validate type
    if (!validateTransactionType(type)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Invalid type. Must be either "income" or "expense"' 
      });
    }

    // Validate category
    if (!validateCategory(category, type, transactionService.EXPENSE_CATEGORIES, transactionService.INCOME_CATEGORIES)) {
      const validCategories = type.toLowerCase() === 'income' 
        ? transactionService.INCOME_CATEGORIES 
        : transactionService.EXPENSE_CATEGORIES;
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: `Invalid category for ${type}. Must be one of: ${validCategories.join(', ')}` 
      });
    }

    // Validate sum
    if (!validatePositiveNumber(sum)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'sum must be a positive number' 
      });
    }

    // Validate payment_method only for expenses
    if (type.toLowerCase() === 'income' && payment_method) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'payment_method is only allowed for expense transactions' 
      });
    }

    const transaction = await transactionService.createTransaction(req.body, req.user?.id);
    res.status(201).json(transaction);
  } catch (error) {
    logger.error('Error creating transaction:', error.message);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        id: 'NOT_FOUND',
        message: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        id: 'DUPLICATE_ERROR',
        message: 'Transaction already exists' 
      });
    }

    res.status(400).json({ 
      id: 'VALIDATION_ERROR',
      message: error.message 
    });
  }
}

module.exports = {
  createTransaction
};



