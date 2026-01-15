const express = require('express');
const router = express.Router();
const costsController = require('../controllers/costs.controller');
const reportsController = require('../controllers/reports.controller');
const { optionalAuth } = require('../middleware/auth');
const { logEndpointAccess } = require('../middleware/logging');

// Get costs with filters
router.get('/api/costs', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/costs', 'GET', req.user?.id || req.query?.userid);
  next();
}, costsController.getCosts);

// Get cost by ID
router.get('/api/costs/:id', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/costs/:id', 'GET', req.params.id);
  next();
}, costsController.getCostById);

// Create cost
router.post('/api/add', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/add', 'POST', req.user?.id || req.body?.userid);
  next();
}, costsController.createCost);

// Get monthly report
router.get('/api/report', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/report', 'GET', req.query?.id);
  next();
}, reportsController.getReport);

module.exports = router;
