const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { optionalAuth } = require('../middleware/auth');
const { logEndpointAccess } = require('../middleware/logging');

// Get report
router.get('/api/report', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/report', 'GET', req.query?.id);
  next();
}, reportsController.getReport);

module.exports = router;



