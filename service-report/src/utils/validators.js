/**
 * Validation utility functions
 */

/**
 * Validate month (1-12)
 */
function validateMonth(month) {
  const monthNum = parseInt(month);
  return !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
}

/**
 * Validate year
 */
function validateYear(year) {
  const yearNum = parseInt(year);
  return !isNaN(yearNum) && yearNum >= 2000 && yearNum <= 2100;
}

module.exports = {
  validateMonth,
  validateYear
};

