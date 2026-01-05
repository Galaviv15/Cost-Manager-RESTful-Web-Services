require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const pino = require('pino');
const { connectDB } = require('./database');
const User = require('./models/User');

const app = express();
const logger = pino();
const PORT = process.env.PORT_USERS || 3000;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));

// Connect to database
connectDB();

/**
 * POST /api/add
 * Create a new user
 * Body: { id, first_name, last_name, birthday, email, phone_number }
 */
app.post('/api/add', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, email, phone_number } = req.body;

    // Validate required fields
    if (!id || !first_name || !last_name || !birthday || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new user
    const user = new User({
      id,
      first_name,
      last_name,
      birthday,
      email,
      phone_number
    });

    await user.save();
    logger.info(`User created: ${user._id}`);

    res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user:', error.message);
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'User with this ID or email already exists' });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users/:id
 * Get user by custom ID with total of all their costs
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get total costs for this user from costs collection
    const Cost = require('./models/Cost');
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
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Users service running on port ${PORT}`);
});

module.exports = app;
