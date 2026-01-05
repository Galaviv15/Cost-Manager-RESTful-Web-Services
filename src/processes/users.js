require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const { connectDB } = require('../config/database');
const User = require('../models/User');
const { logger } = require('../config/logger');
const { mongoLoggingMiddleware, logEndpointAccess } = require('../middleware/logging');

const app = express();
const PORT = process.env.PORT_USERS || 3000;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(mongoLoggingMiddleware);

// Connect to database
connectDB();

/**
 * POST /api/add
 * Create a new user
 * Body: { id, first_name, last_name, birthday }
 */
app.post('/api/add', async (req, res) => {
  logEndpointAccess('/api/add', 'POST', req.body?.id);
  
  try {
    const { id, first_name, last_name, birthday } = req.body;

    // Validate required fields
    if (!id || !first_name || !last_name || !birthday) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Missing required fields: id, first_name, last_name, and birthday are required' 
      });
    }

    // Validate id is a number
    if (typeof id !== 'number' || isNaN(id)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'id must be a number' 
      });
    }

    // Validate birthday is a valid date
    const birthdayDate = new Date(birthday);
    if (isNaN(birthdayDate.getTime())) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'birthday must be a valid date' 
      });
    }

    // Create new user
    const user = new User({
      id,
      first_name,
      last_name,
      birthday: birthdayDate
    });

    await user.save();
    logger.info(`User created: ${user._id}`);

    res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user:', error.message);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        id: 'DUPLICATE_ERROR',
        message: 'User with this ID already exists' 
      });
    }

    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
});

/**
 * GET /api/users
 * Get all users
 */
app.get('/api/users', async (req, res) => {
  logEndpointAccess('/api/users', 'GET');
  
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error.message);
    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by custom ID with total of all their costs
 */
app.get('/api/users/:id', async (req, res) => {
  logEndpointAccess('/api/users/:id', 'GET', req.params.id);
  
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ 
        id: 'VALIDATION_ERROR',
        message: 'Invalid user ID' 
      });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ 
        id: 'NOT_FOUND',
        message: 'User not found' 
      });
    }

    // Get total costs for this user from costs collection
    const Cost = require('../models/Cost');
    const costs = await Cost.find({ userid: userId });
    const total = costs.reduce((sum, cost) => sum + cost.sum, 0);

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total
    });
  } catch (error) {
    logger.error('Error fetching user:', error.message);
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
    logger.info(`Users service running on port ${PORT}`);
  });
}

module.exports = app;
