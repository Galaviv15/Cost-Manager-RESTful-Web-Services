const Cost = require('../models/Cost');
const User = require('../models/User');
const { logger } = require('../config/logger');

/**
 * Create a new cost entry
 */
async function createCost(req, res) {
  try {
    const { description, category, userid, sum } = req.body;

    // Validate required fields
    if (!description || !category || !userid || sum === undefined) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Missing required fields: description, category, userid, and sum are required' 
      });
    }

    // Validate category
    const validCategories = ['food', 'health', 'housing', 'sports', 'education'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
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
    const user = await User.findOne({ id: userid });
    if (!user) {
      return res.status(404).json({ 
        id: 'NOT_FOUND',
        message: 'User not found' 
      });
    }

    // Validate date if provided - server doesn't allow adding costs with dates in the past
    let created_at = new Date();
    if (req.body.created_at) {
      created_at = new Date(req.body.created_at);
      if (isNaN(created_at.getTime())) {
        return res.status(400).json({ 
          id: 'VALIDATION_ERROR',
          message: 'created_at must be a valid date' 
        });
      }
      // Check if date is in the past
      const now = new Date();
      if (created_at < now) {
        return res.status(400).json({ 
          id: 'VALIDATION_ERROR',
          message: 'Cannot add costs with dates in the past' 
        });
      }
    }

    // Create new cost
    const cost = new Cost({
      description,
      category: category.toLowerCase(),
      userid,
      sum,
      created_at
    });

    await cost.save();
    logger.info(`Cost created: ${cost._id} for user: ${userid}`);

    res.status(201).json(cost);
  } catch (error) {
    logger.error('Error creating cost:', error.message);
    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
}

module.exports = {
  createCost
};
