const Log = require('../models/Log');
const { logger } = require('../config/logger');

/**
 * Get team members information
 */
function getTeamMembers() {
  return {
    team: [
      {
        name: 'Team Member 1',
        role: 'Developer'
      },
      {
        name: 'Team Member 2',
        role: 'Developer'
      }
    ]
  };
}

/**
 * Get all logs
 */
async function getAllLogs() {
  return await Log.find({}).sort({ timestamp: -1 }).limit(1000);
}

module.exports = {
  getTeamMembers,
  getAllLogs
};

