const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { logger } = require('../config/logger');

const EXPENSE_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];
const INCOME_CATEGORIES = ['salary', 'freelance', 'investment', 'business', 'gift', 'other'];

/**
 * Create a new transaction
 */
async function createTransaction(transactionData, userIdFromToken = null) {
  let { type, description, category, userid, sum, tags, recurring, created_at, currency, payment_method } = transactionData;
  
  // If user is authenticated, use their userid from token
  if (userIdFromToken) {
    userid = userIdFromToken;
  }

  const normalizedType = type.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  // Validate user exists
  const user = await User.findOne({ id: userid });
  if (!user) {
    throw new Error('User not found');
  }

  // Validate date if provided
  let transactionDate = new Date();
  if (created_at) {
    transactionDate = new Date(created_at);
    if (isNaN(transactionDate.getTime())) {
      throw new Error('created_at must be a valid date');
    }
    // Check if date is in the past
    const now = new Date();
    if (transactionDate < now) {
      throw new Error('Cannot add transactions with dates in the past');
    }
  }

  // Validate recurring if provided
  let recurringData = { enabled: false };
  if (recurring) {
    if (typeof recurring === 'object' && recurring.enabled) {
      if (!recurring.frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(recurring.frequency.toLowerCase())) {
        throw new Error('recurring.frequency is required and must be one of: daily, weekly, monthly, yearly');
      }
      if (!recurring.next_date) {
        throw new Error('recurring.next_date is required when recurring is enabled');
      }
      const nextDate = new Date(recurring.next_date);
      if (isNaN(nextDate.getTime())) {
        throw new Error('recurring.next_date must be a valid date');
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
      throw new Error('tags must be an array of strings');
    }
    tagsArray = tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
                   .map(tag => tag.trim());
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

  return transaction;
}

module.exports = {
  createTransaction,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES
};

