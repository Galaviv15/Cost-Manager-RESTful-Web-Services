const express = require('express');
const router = express.Router();
const costsController = require('../controllers/costs.controller');
const { logEndpointAccess } = require('../middleware/logging');

// Create cost
router.post('/api/costs', (req, res, next) => {
  logEndpointAccess('/api/costs', 'POST', req.body?.userid);
  next();
}, costsController.createCost);

// Alternative endpoint
router.post('/api/costs/add', (req, res, next) => {
  logEndpointAccess('/api/costs/add', 'POST', req.body?.userid);
  next();
}, costsController.createCost);

module.exports = router;
