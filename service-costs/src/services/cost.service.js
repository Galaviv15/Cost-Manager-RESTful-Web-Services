const Cost = require('../models/Cost');
const User = require('../models/User');
const { logger } = require('../config/logger');

/**
 * Create a new cost entry
 */
async function createCost(costData) {
  const { description, category, userid, sum, created_at } = costData;

  // Validate user exists
  const user = await User.findOne({ id: userid });
  if (!user) {
    throw new Error('User not found');
  }

  // Validate date if provided
  let costDate = new Date();
  if (created_at) {
    costDate = new Date(created_at);
    if (isNaN(costDate.getTime())) {
      throw new Error('created_at must be a valid date');
    }
    // Check if date is in the past
    const now = new Date();
    if (costDate < now) {
      throw new Error('Cannot add costs with dates in the past');
    }
  }

  // Create new cost
  const cost = new Cost({
    description,
    category: category.toLowerCase(),
    userid,
    sum,
    created_at: costDate
  });

  await cost.save();
  logger.info(`Cost created: ${cost._id} for user: ${userid}`);

  return cost;
}

module.exports = {
  createCost
};

