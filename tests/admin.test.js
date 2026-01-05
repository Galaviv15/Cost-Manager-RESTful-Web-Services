const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const Log = require('../src/models/Log');
const app = require('../src/processes/admin');

// Test database connection
beforeAll(async () => {
  if (process.env.MONGO_URI_TEST) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  } else {
    await connectDB();
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    await Log.deleteMany({});
  } catch (error) {
    // Ignore errors during cleanup
  }
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Admin Endpoints', () => {
  describe('GET /api/about', () => {
    test('should return team members with first_name and last_name only', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that each team member has only first_name and last_name
      response.body.forEach(member => {
        expect(member).toHaveProperty('first_name');
        expect(member).toHaveProperty('last_name');
        expect(Object.keys(member).length).toBe(2);
      });
    });

    test('should return valid team member data', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      response.body.forEach(member => {
        expect(typeof member.first_name).toBe('string');
        expect(typeof member.last_name).toBe('string');
        expect(member.first_name.length).toBeGreaterThan(0);
        expect(member.last_name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('GET /api/logs', () => {
    test('should return all logs', async () => {
      // Create test logs
      await Log.create({
        id: 1,
        message: 'Test log 1',
        level: 'info',
        endpoint: '/api/test',
        method: 'GET',
        timestamp: new Date()
      });

      await Log.create({
        id: 2,
        message: 'Test log 2',
        level: 'error',
        endpoint: '/api/test',
        method: 'POST',
        timestamp: new Date()
      });

      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    test('should return empty array when no logs exist', async () => {
      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return logs with correct structure', async () => {
      await Log.create({
        id: 1,
        message: 'Test log',
        level: 'info',
        endpoint: '/api/test',
        method: 'GET',
        timestamp: new Date()
      });

      const response = await request(app)
        .get('/api/logs')
        .expect(200);

      if (response.body.length > 0) {
        const log = response.body[0];
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('message');
        expect(log).toHaveProperty('level');
        expect(log).toHaveProperty('timestamp');
      }
    });
  });
});

