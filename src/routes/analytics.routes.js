const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { logEndpointAccess } = require('../middleware/logging');

// Get analytics summary
router.get('/api/analytics/summary', (req, res, next) => {
  logEndpointAccess('/api/analytics/summary', 'GET', req.query?.userid);
  next();
}, analyticsController.getSummary);

// Get analytics trends
router.get('/api/analytics/trends', (req, res, next) => {
  logEndpointAccess('/api/analytics/trends', 'GET', req.query?.userid);
  next();
}, analyticsController.getTrends);

// Get analytics categories
router.get('/api/analytics/categories', (req, res, next) => {
  logEndpointAccess('/api/analytics/categories', 'GET', req.query?.userid);
  next();
}, analyticsController.getCategories);

// Get analytics comparison
router.get('/api/analytics/comparison', (req, res, next) => {
  logEndpointAccess('/api/analytics/comparison', 'GET', req.query?.userid);
  next();
}, analyticsController.getComparison);

// Get yearly analytics
router.get('/api/analytics/yearly', (req, res, next) => {
  logEndpointAccess('/api/analytics/yearly', 'GET', req.query?.userid);
  next();
}, analyticsController.getYearly);

module.exports = router;

