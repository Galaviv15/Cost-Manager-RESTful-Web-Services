const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const app = require('../app');

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

describe('Transaction Endpoints', () => {
  // Create a test user before each test
  beforeEach(async () => {
    await User.create({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      birthday: new Date('1990-01-01')
    });
  });

  describe('POST /api/add', () => {
    test('should create a new expense transaction with valid data', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Lunch at restaurant',
        category: 'food',
        userid: 1,
        sum: 85.50
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('type', 'expense');
      expect(response.body).toHaveProperty('description', 'Lunch at restaurant');
      expect(response.body).toHaveProperty('category', 'food');
      expect(response.body).toHaveProperty('userid', 1);
      expect(response.body).toHaveProperty('sum', 85.50);
    });

    test('should create a new income transaction with valid data', async () => {
      const transactionData = {
        type: 'income',
        description: 'Salary',
        category: 'salary',
        userid: 1,
        sum: 5000
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('type', 'income');
      expect(response.body).toHaveProperty('category', 'salary');
      expect(response.body).toHaveProperty('sum', 5000);
    });

    test('should return error when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({ description: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('message');
    });

    test('should return error when type is invalid', async () => {
      const transactionData = {
        type: 'invalid',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when category is invalid for expense', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'salary',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when category is invalid for income', async () => {
      const transactionData = {
        type: 'income',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when user does not exist', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 999,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(404);

      expect(response.body).toHaveProperty('id', 'NOT_FOUND');
    });

    test('should return error when sum is negative', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: -100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when sum is not a number', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 'not-a-number'
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when trying to add transaction with past date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        created_at: pastDate.toISOString()
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
      expect(response.body.message).toContain('past');
    });

    test('should accept transaction with future date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        created_at: futureDate.toISOString()
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('created_at');
    });

    test('should use current date when created_at is not provided', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('created_at');
      const createdDate = new Date(response.body.created_at);
      const now = new Date();
      // Allow 5 seconds difference for test execution time
      expect(Math.abs(createdDate - now)).toBeLessThan(5000);
    });

    test('should accept all valid expense categories', async () => {
      const categories = ['food', 'health', 'housing', 'sports', 'education'];

      for (const category of categories) {
        const transactionData = {
          type: 'expense',
          description: `Test ${category}`,
          category: category,
          userid: 1,
          sum: 100
        };

        const response = await request(app)
          .post('/api/add')
          .send(transactionData)
          .expect(201);

        expect(response.body).toHaveProperty('category', category);
      }
    });

    test('should accept all valid income categories', async () => {
      const categories = ['salary', 'freelance', 'investment', 'business', 'gift', 'other'];

      for (const category of categories) {
        const transactionData = {
          type: 'income',
          description: `Test ${category}`,
          category: category,
          userid: 1,
          sum: 100
        };

        const response = await request(app)
          .post('/api/add')
          .send(transactionData)
          .expect(201);

        expect(response.body).toHaveProperty('category', category);
      }
    });

    test('should accept tags', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        tags: ['work', 'lunch', 'important']
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('tags');
      expect(Array.isArray(response.body.tags)).toBe(true);
      expect(response.body.tags).toEqual(['work', 'lunch', 'important']);
    });

    test('should accept recurring transaction', async () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      const transactionData = {
        type: 'income',
        description: 'Monthly Salary',
        category: 'salary',
        userid: 1,
        sum: 5000,
        recurring: {
          enabled: true,
          frequency: 'monthly',
          next_date: futureDate.toISOString()
        }
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('recurring');
      expect(response.body.recurring.enabled).toBe(true);
      expect(response.body.recurring.frequency).toBe('monthly');
    });

    test('should return error when recurring is enabled but frequency is missing', async () => {
      const transactionData = {
        type: 'income',
        description: 'Test',
        category: 'salary',
        userid: 1,
        sum: 100,
        recurring: {
          enabled: true
        }
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when payment_method is used for income', async () => {
      const transactionData = {
        type: 'income',
        description: 'Test',
        category: 'salary',
        userid: 1,
        sum: 100,
        payment_method: 'cash'
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should use userid from body when not authenticated (backward compatibility)', async () => {
      const transactionData = {
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('userid', 1);
    });
  });
});

