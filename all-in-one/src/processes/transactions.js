require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const { connectDB } = require('../config/database');
const Transaction = require('../models/Transaction');
const { logger } = require('../config/logger');
const { mongoLoggingMiddleware, logEndpointAccess } = require('../middleware/logging');
const { authenticate, optionalAuth } = require('../middleware/auth');

const app = express();
const PORT = process.env.PORT_TRANSACTIONS || process.env.PORT_COSTS || 3001;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(mongoLoggingMiddleware);

// Connect to database
connectDB();

// Category definitions
const EXPENSE_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];
const INCOME_CATEGORIES = ['salary', 'freelance', 'investment', 'business', 'gift', 'other'];
const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

/**
 * POST /api/add
 * Create a new transaction entry (income or expense)
 * Body: { type, description, category, userid?, sum, tags?, recurring?, created_at?, currency?, payment_method? }
 * If authenticated, userid is taken from token (optional in body)
 * If not authenticated, userid is required in body (backward compatibility)
 */
app.post('/api/add', optionalAuth, async (req, res) => {
  logEndpointAccess('/api/add', 'POST', req.user?.id || req.body?.userid);
  
  try {
    let { type, description, category, userid, sum, tags, recurring, created_at, currency, payment_method } = req.body;
    
    // If user is authenticated, use their userid from token
    if (req.user) {
      userid = req.user.id;
    }

    // Validate required fields
    if (!type || !description || !category || userid === undefined || sum === undefined) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Missing required fields: type, description, category, userid, and sum are required' 
      });
    }

    // Validate type
    const normalizedType = type.toLowerCase();
    if (!['income', 'expense'].includes(normalizedType)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Invalid type. Must be either "income" or "expense"' 
      });
    }

    // Validate category based on type
    const normalizedCategory = category.toLowerCase();
    const validCategories = normalizedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: `Invalid category for ${normalizedType}. Must be one of: ${validCategories.join(', ')}` 
      });
    }

    // Validate sum is a number
    if (typeof sum !== 'number' || isNaN(sum) || sum < 0) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'sum must be a positive number' 
      });
    }

    // Validate user exists
    const User = require('../models/User');
    const user = await User.findOne({ id: userid });
    if (!user) {
      return res.status(404).json({ 
        id: 'NOT_FOUND',
        message: 'User not found' 
      });
    }

    // Validate date if provided - server doesn't allow adding transactions with dates in the past
    let transactionDate = new Date();
    if (created_at) {
      transactionDate = new Date(created_at);
      if (isNaN(transactionDate.getTime())) {
        return res.status(400).json({ 
          id: 'VALIDATION_ERROR',
          message: 'created_at must be a valid date' 
        });
      }
      // Check if date is in the past
      const now = new Date();
      if (transactionDate < now) {
        return res.status(400).json({ 
          id: 'VALIDATION_ERROR',
          message: 'Cannot add transactions with dates in the past' 
        });
      }
    }

    // Validate recurring if provided
    let recurringData = { enabled: false };
    if (recurring) {
      if (typeof recurring === 'object' && recurring.enabled) {
        if (!recurring.frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(recurring.frequency.toLowerCase())) {
          return res.status(400).json({ 
            id: 'VALIDATION_ERROR',
            message: 'recurring.frequency is required and must be one of: daily, weekly, monthly, yearly' 
          });
        }
        if (!recurring.next_date) {
          return res.status(400).json({ 
            id: 'VALIDATION_ERROR',
            message: 'recurring.next_date is required when recurring is enabled' 
          });
        }
        const nextDate = new Date(recurring.next_date);
        if (isNaN(nextDate.getTime())) {
          return res.status(400).json({ 
            id: 'VALIDATION_ERROR',
            message: 'recurring.next_date must be a valid date' 
          });
        }
        recurringData = {
          enabled: true,
          frequency: recurring.frequency.toLowerCase(),
          next_date: nextDate
        };
      }
    }

    // Validate tags if provided
    let tagsArray = [];
    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ 
          id: 'VALIDATION_ERROR',
          message: 'tags must be an array of strings' 
        });
      }
      tagsArray = tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
                     .map(tag => tag.trim());
    }

    // Validate payment_method only for expenses
    if (normalizedType === 'income' && payment_method) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'payment_method is only allowed for expense transactions' 
      });
    }

    // Create new transaction
    const transaction = new Transaction({
      type: normalizedType,
      description: description.trim(),
      category: normalizedCategory,
      userid,
      sum,
      created_at: transactionDate,
      currency: currency || 'ILS',
      payment_method: normalizedType === 'expense' ? payment_method : undefined,
      tags: tagsArray,
      recurring: recurringData
    });

    await transaction.save();
    logger.info(`Transaction created: ${transaction._id} (${normalizedType}) for user: ${userid}`);

    res.status(201).json(transaction);
  } catch (error) {
    logger.error('Error creating transaction:', error.message);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        id: 'DUPLICATE_ERROR',
        message: 'Transaction already exists' 
      });
    }

    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    id: 'SERVER_ERROR',
    message: 'Internal server error' 
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  app.listen(PORT, () => {
    logger.info(`Transactions service running on port ${PORT}`);
  });
}

module.exports = app;

