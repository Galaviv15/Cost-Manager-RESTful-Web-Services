require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const pino = require('pino');
const { connectDB } = require('./database');
const Cost = require('./models/Cost');

const app = express();
const logger = pino();
const PORT = process.env.PORT_COSTS || 3001;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));

// Connect to database
connectDB();

/**
 * POST /api/add
 * Create a new cost entry
 * Body: { description, category, userid, sum, currency, payment_method }
 */
app.post('/api/add', async (req, res) => {
  try {
    const { description, category, userid, sum, currency, payment_method } = req.body;

    // Validate required fields
    if (!description || !category || !userid || sum === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate category
    const validCategories = ['food', 'health', 'housing', 'sports', 'education'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      });
    }

    // Validate user exists
    const User = require('./models/User');
    const user = await User.findOne({ id: userid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new cost
    const cost = new Cost({
      description,
      category: category.toLowerCase(),
      userid,
      sum,
      currency: currency || 'ILS',
      payment_method: payment_method ? payment_method.toLowerCase() : undefined
    });

    await cost.save();
    logger.info(`Cost created: ${cost._id} for user: ${userid}`);

    res.status(201).json(cost);
  } catch (error) {
    logger.error('Error creating cost:', error.message);
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
  logger.info(`Costs service running on port ${PORT}`);
});

module.exports = app;
