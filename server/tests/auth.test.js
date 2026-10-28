const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/models');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/hirehub_test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'candidate',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should not register duplicate email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('should not allow admin registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test Admin',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
