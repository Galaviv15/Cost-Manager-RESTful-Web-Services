const adminService = require('../services/admin.service');
const { logger } = require('../config/logger');

/**
 * Get team members
 */
function getAbout(req, res) {
  try {
    const teamMembers = adminService.getTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    logger.error('Error in about endpoint:', error.message);
    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
}

/**
 * Get all logs
 */
async function getLogs(req, res) {
  try {
    const logs = await adminService.getAllLogs();
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching logs:', error.message);
    res.status(500).json({ 
      id: 'SERVER_ERROR',
      message: error.message 
    });
  }
}

module.exports = {
  getAbout,
  getLogs
};



