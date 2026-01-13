const costService = require('../services/cost.service');
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

    const cost = await costService.createCost(req.body);
    res.status(201).json(cost);
  } catch (error) {
    logger.error('Error creating cost:', error.message);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        id: 'NOT_FOUND',
        message: error.message 
      });
    }

    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
}

module.exports = {
  createCost
};
