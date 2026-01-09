const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals.controller');
const { logEndpointAccess } = require('../middleware/logging');

// Create goal
router.post('/api/goals', (req, res, next) => {
  logEndpointAccess('/api/goals', 'POST', req.body?.userid);
  next();
}, goalsController.createGoal);

// Get goals
router.get('/api/goals', (req, res, next) => {
  logEndpointAccess('/api/goals', 'GET', req.query?.userid);
  next();
}, goalsController.getGoals);

// Update goal
router.put('/api/goals/:id', (req, res, next) => {
  logEndpointAccess('/api/goals/:id', 'PUT', req.params.id);
  next();
}, goalsController.updateGoal);

// Delete goal
router.delete('/api/goals/:id', (req, res, next) => {
  logEndpointAccess('/api/goals/:id', 'DELETE', req.params.id);
  next();
}, goalsController.deleteGoal);

// Get goal progress
router.get('/api/goals/:id/progress', (req, res, next) => {
  logEndpointAccess('/api/goals/:id/progress', 'GET', req.params.id);
  next();
}, goalsController.getGoalProgress);

module.exports = router;

