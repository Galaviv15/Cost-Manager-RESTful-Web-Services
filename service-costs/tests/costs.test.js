const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Cost = require('../src/models/Cost');
const Report = require('../src/models/Report');
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
    await Cost.deleteMany({});
    await Report.deleteMany({});
  } catch (error) {
    // Ignore errors during cleanup
  }
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Cost Endpoints', () => {
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
    test('should create a new expense cost with valid data', async () => {
      const costData = {
        type: 'expense',
        description: 'Lunch at restaurant',
        category: 'food',
        userid: 1,
        sum: 85.50
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('type', 'expense');
      expect(response.body).toHaveProperty('description', 'Lunch at restaurant');
      expect(response.body).toHaveProperty('category', 'food');
      expect(response.body).toHaveProperty('userid', 1);
      expect(response.body).toHaveProperty('sum', 85.50);
    });

    test('should create a new income cost with valid data', async () => {
      const costData = {
        type: 'income',
        description: 'Salary',
        category: 'salary',
        userid: 1,
        sum: 5000
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
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
      const costData = {
        type: 'invalid',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when category is invalid for expense', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'salary',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when category is invalid for income', async () => {
      const costData = {
        type: 'income',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when user does not exist', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 999,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(404);

      expect(response.body).toHaveProperty('id', 'NOT_FOUND');
    });

    test('should return error when sum is negative', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: -100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when sum is not a number', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 'not-a-number'
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when trying to add cost with past date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        created_at: pastDate.toISOString()
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
      expect(response.body.message).toContain('past');
    });

    test('should accept cost with future date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        created_at: futureDate.toISOString()
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('created_at');
    });

    test('should use current date when created_at is not provided', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
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
        const costData = {
          type: 'expense',
          description: `Test ${category}`,
          category: category,
          userid: 1,
          sum: 100
        };

        const response = await request(app)
          .post('/api/add')
          .send(costData)
          .expect(201);

        expect(response.body).toHaveProperty('category', category);
      }
    });

    test('should accept all valid income categories', async () => {
      const categories = ['salary', 'freelance', 'investment', 'business', 'gift', 'other'];

      for (const category of categories) {
        const costData = {
          type: 'income',
          description: `Test ${category}`,
          category: category,
          userid: 1,
          sum: 100
        };

        const response = await request(app)
          .post('/api/add')
          .send(costData)
          .expect(201);

        expect(response.body).toHaveProperty('category', category);
      }
    });

    test('should accept tags', async () => {
      const costData = {
        type: 'expense',
        description: 'Test',
        category: 'food',
        userid: 1,
        sum: 100,
        tags: ['work', 'lunch', 'important']
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('tags');
      expect(Array.isArray(response.body.tags)).toBe(true);
      expect(response.body.tags).toEqual(['work', 'lunch', 'important']);
    });

    test('should accept recurring cost', async () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      const costData = {
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
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('recurring');
      expect(response.body.recurring.enabled).toBe(true);
      expect(response.body.recurring.frequency).toBe('monthly');
    });

    test('should return error when recurring is enabled but frequency is missing', async () => {
      const costData = {
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
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when payment_method is used for income', async () => {
      const costData = {
        type: 'income',
        description: 'Test',
        category: 'salary',
        userid: 1,
        sum: 100,
        payment_method: 'cash'
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should use userid from body when not authenticated (backward compatibility)', async () => {
      const costData = {
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('userid', 1);
    });

    test('should create cost with userid from token when authenticated', async () => {
      // Create a user with email and password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        birthday: new Date('1992-05-15'),
        email: 'jane@example.com',
        password: hashedPassword
      });

      // Generate JWT token (same format as service-users)
      const token = jwt.sign(
        { userId: 2, email: 'jane@example.com' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const costData = {
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        sum: 100
        // userid not provided - should be taken from token
      };

      const response = await request(app)
        .post('/api/add')
        .set('Authorization', `Bearer ${token}`)
        .send(costData)
        .expect(201);

      expect(response.body).toHaveProperty('userid', 2);
      expect(response.body).toHaveProperty('type', 'expense');
      expect(response.body).toHaveProperty('description', 'Lunch');
    });

    test('should prefer userid from token over body when authenticated', async () => {
      // Create a user with email and password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        birthday: new Date('1992-05-15'),
        email: 'jane@example.com',
        password: hashedPassword
      });

      // Generate JWT token (same format as service-users)
      const token = jwt.sign(
        { userId: 2, email: 'jane@example.com' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const costData = {
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 999, // Different userid in body - should be ignored
        sum: 100
      };

      const response = await request(app)
        .post('/api/add')
        .set('Authorization', `Bearer ${token}`)
        .send(costData)
        .expect(201);

      // Should use userid from token (2), not from body (999)
      expect(response.body).toHaveProperty('userid', 2);
      expect(response.body.userid).not.toBe(999);
    });
  });

  describe('GET /api/report', () => {
    test('should return report with correct format', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Create test costs
      await Cost.create({
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 50,
        created_at: new Date(year, month - 1, 15)
      });

      await Cost.create({
        type: 'expense',
        description: 'Book',
        category: 'education',
        userid: 1,
        sum: 100,
        created_at: new Date(year, month - 1, 20)
      });

      const response = await request(app)
        .get(`/api/report?id=1&year=${year}&month=${month}`)
        .expect(200);

      expect(response.body).toHaveProperty('userid', 1);
      expect(response.body).toHaveProperty('year', year);
      expect(response.body).toHaveProperty('month', month);
      expect(response.body).toHaveProperty('costs');
      expect(Array.isArray(response.body.costs)).toBe(true);
    });

    test('should return all expense categories even when empty', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const response = await request(app)
        .get(`/api/report?id=1&year=${year}&month=${month}`)
        .expect(200);

      expect(response.body.costs.length).toBe(5); // All 5 expense categories
      const expenseCategories = ['food', 'health', 'housing', 'sports', 'education'];
      expenseCategories.forEach(category => {
        const categoryObj = response.body.costs.find(c => c[category] !== undefined);
        expect(categoryObj).toBeDefined();
        expect(Array.isArray(categoryObj[category])).toBe(true);
      });
    });

    test('should return error when required parameters are missing', async () => {
      const response = await request(app)
        .get('/api/report')
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when user not found', async () => {
      const response = await request(app)
        .get('/api/report?id=999&year=2025&month=1')
        .expect(404);

      expect(response.body).toHaveProperty('id', 'NOT_FOUND');
    });

    test('should return error when month is invalid', async () => {
      const response = await request(app)
        .get('/api/report?id=1&year=2025&month=13')
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should return error when month is less than 1', async () => {
      const response = await request(app)
        .get('/api/report?id=1&year=2025&month=0')
        .expect(400);

      expect(response.body).toHaveProperty('id', 'VALIDATION_ERROR');
    });

    test('should include day, sum, and description in cost items', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      await Cost.create({
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 50,
        created_at: new Date(year, month - 1, 17)
      });

      const response = await request(app)
        .get(`/api/report?id=1&year=${year}&month=${month}`)
        .expect(200);

      const foodCategory = response.body.costs.find(c => c.food !== undefined);
      expect(foodCategory).toBeDefined();
      expect(foodCategory.food.length).toBe(1);
      expect(foodCategory.food[0]).toHaveProperty('day', 17);
      expect(foodCategory.food[0]).toHaveProperty('sum', 50);
      expect(foodCategory.food[0]).toHaveProperty('description', 'Lunch');
    });

    test('should cache reports for past months (Computed Design Pattern)', async () => {
      const now = new Date();
      let pastMonthIndex = now.getMonth(); // 0-11 (current month index)
      let pastYear = now.getFullYear();
      
      // Calculate previous month
      if (pastMonthIndex === 0) {
        // If current month is January (0), previous month is December (12) of previous year
        pastMonthIndex = 11; // December index
        pastYear = pastYear - 1;
      } else {
        pastMonthIndex = pastMonthIndex - 1;
      }
      
      // Convert to 1-12 format for API (pastMonthIndex is 0-11, we need 1-12)
      const pastMonth = pastMonthIndex + 1;

      // Create cost in past month (Date constructor uses 0-11 for months)
      await Cost.create({
        type: 'expense',
        description: 'Past expense',
        category: 'food',
        userid: 1,
        sum: 50,
        created_at: new Date(pastYear, pastMonthIndex, 15)
      });

      // First request - should generate and cache
      const response1 = await request(app)
        .get(`/api/report?id=1&year=${pastYear}&month=${pastMonth}`)
        .expect(200);

      expect(response1.body).toHaveProperty('userid', 1);

      // Check that report was cached
      const cachedReport = await Report.findOne({
        userid: 1,
        year: pastYear,
        month: pastMonth
      });
      expect(cachedReport).toBeDefined();

      // Second request - should return from cache
      const response2 = await request(app)
        .get(`/api/report?id=1&year=${pastYear}&month=${pastMonth}`)
        .expect(200);

      expect(response2.body).toHaveProperty('userid', 1);
    });

    test('should not cache reports for current month', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      await Cost.create({
        type: 'expense',
        description: 'Current expense',
        category: 'food',
        userid: 1,
        sum: 50,
        created_at: new Date(year, month - 1, 15)
      });

      // First request - should generate but not cache
      const response1 = await request(app)
        .get(`/api/report?id=1&year=${year}&month=${month}`)
        .expect(200);

      expect(response1.body).toHaveProperty('userid', 1);

      // Check that report was NOT cached
      const cachedReport = await Report.findOne({
        userid: 1,
        year: year,
        month: month
      });
      expect(cachedReport).toBeNull();
    });

    test('should only include expense costs in report (not income)', async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Create expense
      await Cost.create({
        type: 'expense',
        description: 'Lunch',
        category: 'food',
        userid: 1,
        sum: 50,
        created_at: new Date(year, month - 1, 15)
      });

      // Create income (should not appear in report)
      await Cost.create({
        type: 'income',
        description: 'Salary',
        category: 'salary',
        userid: 1,
        sum: 10000,
        created_at: new Date(year, month - 1, 20)
      });

      const response = await request(app)
        .get(`/api/report?id=1&year=${year}&month=${month}`)
        .expect(200);

      // Should only have expense categories
      const foodCategory = response.body.costs.find(c => c.food !== undefined);
      expect(foodCategory).toBeDefined();
      expect(foodCategory.food.length).toBe(1);
      expect(foodCategory.food[0].description).toBe('Lunch');

      // Should not have income categories
      const salaryCategory = response.body.costs.find(c => c.salary !== undefined);
      expect(salaryCategory).toBeUndefined();
    });
  });
});

