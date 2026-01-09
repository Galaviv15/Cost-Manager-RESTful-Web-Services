const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { logEndpointAccess } = require('../middleware/logging');

// Get about/team members
router.get('/api/about', (req, res, next) => {
  logEndpointAccess('/api/about', 'GET');
  next();
}, adminController.getAbout);

// Get logs
router.get('/api/logs', (req, res, next) => {
  logEndpointAccess('/api/logs', 'GET');
  next();
}, adminController.getLogs);

module.exports = router;



