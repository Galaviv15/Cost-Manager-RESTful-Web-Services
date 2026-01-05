const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');
const { optionalAuth } = require('../middleware/auth');
const { logEndpointAccess } = require('../middleware/logging');

// Create transaction
router.post('/api/add', optionalAuth, (req, res, next) => {
  logEndpointAccess('/api/add', 'POST', req.user?.id || req.body?.userid);
  next();
}, transactionsController.createTransaction);

module.exports = router;

