const request = require('supertest');
const { app } = require('./setup');
const User = require('../models/user');

describe('GET /api/users/:id', () => {
  const testUser = {
    id: '123123',
    first_name: 'mosh',
    last_name: 'israeli',
    birthday: new Date('1990-01-01'),
    marital_status: 'single'
  };

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
    
    // Create test user and verify it was created
    const createdUser = await User.create(testUser);
    expect(createdUser).toBeTruthy();
    expect(createdUser.id).toBe(testUser.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return user details and total cost', async () => {
    // Verify user exists before test
    const existingUser = await User.findOne({ id: testUser.id });
    expect(existingUser).toBeTruthy();
    
    const response = await request(app)
      .get(`/api/users/${testUser.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('first_name', testUser.first_name);
    expect(response.body).toHaveProperty('last_name', testUser.last_name);
    expect(response.body).toHaveProperty('id', testUser.id);
    expect(response.body).toHaveProperty('total');
    expect(typeof response.body.total).toBe('number');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/nonexistent');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User not found');
  });
});
