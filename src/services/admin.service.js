const Log = require('../models/Log');
const { logger } = require('../config/logger');

/**
 * Team members data
 */
const teamMembers = [
  {
    first_name: 'Gal',
    last_name: 'Aviv'
  },
  {
    first_name: 'Bar',
    last_name: 'Bibi'
  },
  {
    first_name: 'Ofir',
    last_name: 'Avisror'
  }
];

/**
 * Get team members
 */
function getTeamMembers() {
  return teamMembers;
}

/**
 * Get all logs
 */
async function getAllLogs() {
  return await Log.find({}).sort({ timestamp: -1 });
}

module.exports = {
  getTeamMembers,
  getAllLogs
};

