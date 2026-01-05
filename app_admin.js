require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const pino = require('pino');
const { connectDB } = require('./database');

const app = express();
const logger = pino();
const PORT = process.env.PORT_ADMIN || 3003;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));

// Connect to database
connectDB();

/**
 * Team members data
 */
const teamMembers = [
  {
    name: 'Gal Aviv',
    role: 'Backend Developer',
    email: 'galaviv@gmail.com'
  },
  {
    name: 'Bar Bibi',
    role: 'Backend Developer',
    email: 'barbibi@gmail.com'
  },
  {
    name: 'Ofir Avisror',
    role: 'Backend Developer',
    email: 'ofiravisror@gmail.com'
  },
];

/**
 * GET /api/about
 * Returns team members list and project information
 */
app.get('/api/about', (req, res) => {
  try {
    logger.info('About endpoint accessed');

    res.json({
      project: {
        name: 'Cost Manager RESTful Web Service',
        version: '1.0.0',
        description: 'A comprehensive expense tracking and reporting system'
      },
      team: teamMembers
    });
  } catch (error) {
    logger.error('Error in about endpoint:', error.message);
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
  logger.info(`Admin service running on port ${PORT}`);
});

module.exports = app;
