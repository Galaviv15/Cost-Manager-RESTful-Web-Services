const Cost = require('../models/Cost');
const Report = require('../models/Report');
const { logger } = require('../config/logger');

/**
 * Check if a date is in the current month
 */
function isCurrentMonth(year, month) {
  const now = new Date();
  return year === now.getFullYear() && month === (now.getMonth() + 1);
}

/**
 * Generate report from costs
 * This function implements the Computed Design Pattern by generating
 * reports that can be cached for past months.
 * 
 * Computed Design Pattern Implementation:
 * For past months, reports are calculated once and cached in the database.
 * For current month, reports are always calculated fresh without caching.
 * This ensures data accuracy for the current month while optimizing
 * performance for historical data queries.
 */
async function generateReport(userid, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const costs = await Cost.find({
    userid,
    created_at: { $gte: startDate, $lte: endDate }
  });

  // Filter only expenses (according to requirements, report should show only expense categories)
  const expenses = costs.filter(c => c.type === 'expense');

  // Expense categories as per requirements: food, health, housing, sports, education
  // All categories must appear in the report, even if empty
  const expenseCategories = ['food', 'health', 'housing', 'sports', 'education'];
  const costsArray = [];

  expenseCategories.forEach(category => {
    const categoryExpenses = expenses.filter(e => e.category === category);
    const categoryData = categoryExpenses.map(e => {
      const day = new Date(e.created_at).getDate();
      return {
        sum: e.sum,
        description: e.description,
        day: day
      };
    });
    
    // Always include category, even if empty array
    const categoryObject = {};
    categoryObject[category] = categoryData;
    costsArray.push(categoryObject);
  });

  return {
    userid: userid,
    year: year,
    month: month,
    costs: costsArray
  };
}

/**
 * Get report for a specific month/year
 * Implements Computed Design Pattern with caching
 * 
 * Computed Design Pattern:
 * - For past months: Check cache first, if exists return cached data,
 *   otherwise generate, save to cache, and return
 * - For current month: Always calculate fresh (don't cache)
 */
async function getReport(userid, year, month) {
  const current = isCurrentMonth(year, month);

  if (!current) {
    /**
     * Computed Design Pattern Implementation:
     * For past months, we check if a cached report exists in the database.
     * If it exists, we return it immediately without recalculating.
     * If it doesn't exist, we generate the report, save it to the cache,
     * and then return it. This ensures that past month reports are computed
     * only once and reused for subsequent requests.
     */
    // Past month - check cache first
    let cachedReport = await Report.findOne({
      userid,
      year,
      month
    });

    if (cachedReport) {
      logger.info(`Returning cached report for user ${userid}, ${year}-${month}`);
      return cachedReport.data;
    }

    // Not in cache - generate, save, and return
    logger.info(`Generating and caching report for user ${userid}, ${year}-${month}`);
    const reportData = await generateReport(userid, year, month);

    const newReport = new Report({
      userid,
      year,
      month,
      data: reportData,
      saved_at: new Date()
    });

    await newReport.save();
    return reportData;
  } else {
    // Current month - always calculate from scratch (don't cache)
    logger.info(`Generating on-the-fly report for current month, user ${userid}`);
    return await generateReport(userid, year, month);
  }
}

module.exports = {
  getReport,
  generateReport,
  isCurrentMonth
};

