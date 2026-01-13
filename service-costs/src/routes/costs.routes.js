const express = require('express');
const router = express.Router();
const costsController = require('../controllers/costs.controller');
const { logEndpointAccess } = require('../middleware/logging');

// Create cost
router.post('/api/add', (req, res, next) => {
  logEndpointAccess('/api/add', 'POST', req.body?.userid);
  next();
}, costsController.createCost);

module.exports = router;
