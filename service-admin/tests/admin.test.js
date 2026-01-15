const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const app = require('../app');

// Test database connection
beforeAll(async () => {
  if (process.env.MONGO_URI_TEST) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  } else {
    await connectDB();
  }
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Admin Endpoints', () => {
  describe('GET /api/about', () => {
    test('should return team members', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return valid team member data', async () => {
      const response = await request(app)
        .get('/api/about')
        .expect(200);

      response.body.forEach(member => {
        expect(member).toHaveProperty('first_name');
        expect(member).toHaveProperty('last_name');
        expect(typeof member.first_name).toBe('string');
        expect(typeof member.last_name).toBe('string');
      });
    });
  });
});

