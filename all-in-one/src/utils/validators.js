/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

/**
 * Validate transaction type
 */
function validateTransactionType(type) {
  return ['income', 'expense'].includes(type.toLowerCase());
}

/**
 * Validate transaction category based on type
 */
function validateCategory(category, type, expenseCategories, incomeCategories) {
  const normalizedCategory = category.toLowerCase();
  const validCategories = type.toLowerCase() === 'income' ? incomeCategories : expenseCategories;
  return validCategories.includes(normalizedCategory);
}

/**
 * Validate date
 */
function validateDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate positive number
 */
function validatePositiveNumber(value) {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

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
  validateEmail,
  validateTransactionType,
  validateCategory,
  validateDate,
  validatePositiveNumber,
  validateMonth,
  validateYear
};



