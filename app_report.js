require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const pino = require('pino');
const { connectDB } = require('./database');
const Cost = require('./models/Cost');
const Report = require('./models/Report');
const User = require('./models/User');

const app = express();
const logger = pino();
const PORT = process.env.PORT_REPORT || 3002;

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));

// Connect to database
connectDB();

/**
 * Helper function to check if a date is in the past or current month
 */
function isCurrentMonth(year, month) {
  const now = new Date();
  return year === now.getFullYear() && month === (now.getMonth() + 1);
}

/**
 * Helper function to generate report from costs
 */
async function generateReport(userid, year, month) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const costs = await Cost.find({
      userid,
      created_at: { $gte: startDate, $lte: endDate }
    });

    // Group by category
    const reportData = {};
    const categories = ['food', 'health', 'housing', 'sports', 'education'];

    categories.forEach(category => {
      const categoryCosts = costs.filter(c => c.category === category);
      reportData[category] = categoryCosts.map(c => ({
        description: c.description,
        sum: c.sum,
        currency: c.currency,
        payment_method: c.payment_method,
        created_at: c.created_at
      }));
    });

    return reportData;
  } catch (error) {
    logger.error('Error generating report:', error.message);
    throw error;
  }
}

/**
 * GET /api/report
 * Get report for a specific month/year
 * Query params: userid, year, month
 * Implements Computed Design Pattern with caching
 */
app.get('/api/report', async (req, res) => {
  try {
    const { userid, year, month } = req.query;

    // Validate required params
    if (!userid || !year || !month) {
      return res.status(400).json({ error: 'Missing required query parameters: userid, year, month' });
    }

    const userIdNum = parseInt(userid);
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    // Validate ranges
    if (isNaN(userIdNum) || isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    // Verify user exists
    const user = await User.findOne({ id: userIdNum });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if requesting current month or past month
    const current = isCurrentMonth(yearNum, monthNum);

    if (!current) {
      // Past month - check cache first
      let cachedReport = await Report.findOne({
        userid: userIdNum,
        year: yearNum,
        month: monthNum
      });

      if (cachedReport) {
        logger.info(`Returning cached report for user ${userIdNum}, ${yearNum}-${monthNum}`);
        return res.json(cachedReport.data);
      }

      // Not in cache - generate, save, and return
      logger.info(`Generating and caching report for user ${userIdNum}, ${yearNum}-${monthNum}`);
      const reportData = await generateReport(userIdNum, yearNum, monthNum);

      const newReport = new Report({
        userid: userIdNum,
        year: yearNum,
        month: monthNum,
        data: reportData,
        saved_at: new Date()
      });

      await newReport.save();
      return res.json(reportData);
    } else {
      // Current month - always calculate from scratch (don't cache)
      logger.info(`Generating on-the-fly report for current month, user ${userIdNum}`);
      const reportData = await generateReport(userIdNum, yearNum, monthNum);
      return res.json(reportData);
    }
  } catch (error) {
    logger.error('Error fetching report:', error.message);
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
  logger.info(`Report service running on port ${PORT}`);
});

module.exports = app;
