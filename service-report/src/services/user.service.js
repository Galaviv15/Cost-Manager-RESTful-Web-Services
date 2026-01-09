const User = require('../models/User');
const { logger } = require('../config/logger');

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

module.exports = {
  getUserById
};

