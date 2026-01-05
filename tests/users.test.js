const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const app = require('../app_users');

// Test database connection
beforeAll(async () => {
  // Use a test database URI or mock connection
  if (process.env.MONGO_URI_TEST) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  } else {
    // For testing, we'll use the same connection
    await connectDB();
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    await User.deleteMany({});
    await Transaction.deleteMany({});
  } catch (error) {
    // Ignore errors during cleanup
  }
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Endpoints', () => {
  describe('POST /api/add', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/add')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('first_name', 'John');
      expect(response.body).toHaveProperty('last_name', 'Doe');
    });

    test('should return error when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ id: 1 })
        .expect(400);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message');
      expect(response.body.id).toBe('VALIDATION_ERROR');
    });

    test('should return error when id is not a number', async () => {
      const userData = {
        id: 'not-a-number',
        first_name: 'John',
        last_name: 'Doe',
        birthday: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/add')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when birthday is invalid', async () => {
      const userData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/add')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when user with same id already exists', async () => {
      const userData = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: '1990-01-01'
      };

      // Create first user
      await request(app)
        .post('/api/add')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/add')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('id', 'DUPLICATE_ERROR');
    });
  });

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      // Create test users with unique emails to avoid sparse index issues
      // Note: Users with email don't need password if created directly (not through API)
      await User.create({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: new Date('1990-01-01'),
        email: 'john@example.com',
        password: 'password123' // Required when email is provided
      });

      await User.create({
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        birthday: new Date('1992-05-15'),
        email: 'jane@example.com',
        password: 'password123' // Required when email is provided
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('first_name');
      expect(response.body[0]).toHaveProperty('last_name');
    });

    test('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return user with total costs', async () => {
      // Create user
      await User.create({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: new Date('1990-01-01')
      });

      // Create transactions for user
      await Transaction.create({
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 50
      });

      await Transaction.create({
        type: 'expense',
        description: 'Book',
        category: 'education',
        userid: 1,
        sum: 100
      });

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('first_name', 'John');
      expect(response.body).toHaveProperty('last_name', 'Doe');
      expect(response.body).toHaveProperty('total', 150); // Backward compatibility
      expect(response.body).toHaveProperty('total_expenses', 150);
      expect(response.body).toHaveProperty('total_income', 0);
      expect(response.body).toHaveProperty('balance', -150);
    });

    test('should return error when user not found', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body).toHaveProperty('id', 'NOT_FOUND');
      expect(response.body).toHaveProperty('message');
    });

    test('should return error when id is invalid', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return total of 0 when user has no costs', async () => {
      await User.create({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birthday: new Date('1990-01-01')
      });

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toHaveProperty('total', 0);
    });
  });
});

