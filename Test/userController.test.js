const request = require('supertest');
const app = require('../index'); // Assuming your Express app instance is exported from index.js
const User = require('../models/userModel');

describe('User Authentication Endpoints', () => {
  let testUser;
  beforeEach(async () => {
    // Create a test user for testing sign-in
    testUser = await User.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.deleteMany();
  });

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  it('should sign in an existing user', async () => {
    const res = await request(app)
      .post('/api/users/signin')
      .send({
        email: testUser.email,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
