const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../config/logger');

/**
 * Optional authentication middleware
 * Adds user info if token is present, but doesn't fail if missing
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      const user = await User.findOne({ id: decoded.userId });
      
      if (user) {
        req.user = {
          id: user.id,
          userId: user.id,
          email: user.email
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

module.exports = {
  optionalAuth
};

