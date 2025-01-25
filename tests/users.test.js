const request = require('supertest');
const { app } = require('./setup');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('GET /api/users/:id', () => {
  let testUser;

  beforeAll(async () => {
    try {
      // Log current database
      console.log('Current database:', mongoose.connection.db.databaseName);
      
      // Clear any existing users
      await User.deleteMany({});
      console.log('Cleared existing users');
      
      // Create test user
      testUser = await User.create({
        id: '123123',
        first_name: 'mosh',
        last_name: 'levy',
        birthday: new Date('1990-01-01'),
        marital_status: 'single'
      });
      console.log('Test user created:', testUser);

      // Verify user was created
      const verifyCreation = await User.findById(testUser._id);
      console.log('Verify creation by _id:', verifyCreation);
      
      // Try finding by id field
      const verifyById = await User.findOne({ id: '123123' });
      console.log('Verify by id field:', verifyById);
      
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error('Error in test cleanup:', error);
      throw error;
    }
  });

  it('should return user details and total cost', async () => {
    // Verify user exists before running test
    const verifyUser = await User.findOne({ id: testUser.id });
    console.log('Found user before test:', verifyUser);
    expect(verifyUser).toBeTruthy();
    
    const response = await request(app).get(`/api/users/${testUser.id}`);
    console.log('Response body:', response.body);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('first_name', testUser.first_name);
    expect(response.body).toHaveProperty('last_name', testUser.last_name);
    expect(response.body).toHaveProperty('id', testUser.id);
    expect(response.body).toHaveProperty('total');
  });

  it('should return an error for a non-existent user', async () => {
    const response = await request(app).get('/api/users/invalid_id');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
