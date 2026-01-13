const express = require('express');
const router = express.Router();
const costsController = require('../controllers/costs.controller');
const { optionalAuth } = require('../middleware/auth');
const { logEndpointAccess } = require('../middleware/logging');

// Create cost
router.post('/api/add', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/add', 'POST', req.user?.id || req.body?.userid);
  next();
}, costsController.createCost);

module.exports = router;
