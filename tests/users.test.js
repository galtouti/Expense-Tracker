/**
 * @module tests/users
 * @description Test suite for user-related API endpoints
 */

const request = require('supertest');
const { app } = require('./setup');

describe('Users API', () => {
  /* Test user ID that meets the minimum length requirement */
  const testUserId = '12345';
  let createdUser;

  /**
   * Test suite for user creation endpoint
   * @group POST /api/users
   */
  describe('POST /api/users', () => {
    /* Test successful user creation with valid data */
    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          id: testUserId,
          first_name: 'TestFirst',
          last_name: 'TestLast',
          birthday: '1990-01-01',
          marital_status: 'single'
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.id).toBe(testUserId);
      expect(response.body.first_name).toBe('TestFirst');

      /* Store created user for subsequent tests */
      createdUser = response.body;
    });

    /* Test validation of user ID format */
    it('should fail if ID is invalid', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          id: '123', // Invalid: less than 5 digits
          first_name: 'Invalid',
          last_name: 'User',
          birthday: '1990-01-01',
          marital_status: 'single'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/Invalid ID/);
    });
  });

  /**
   * Test suite for user retrieval endpoint
   * @group GET /api/users/:id
   */
  describe('GET /api/users/:id', () => {
    /* Test successful retrieval of existing user */
    it('should return user details for a valid ID', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(testUserId);
      expect(response.body).toHaveProperty('total');
    });

    /* Test handling of non-existent user request */
    it('should return 404 for non-existing user', async () => {
      const response = await request(app).get('/api/users/99999');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toMatch(/User not found/);
    });
  });
});
