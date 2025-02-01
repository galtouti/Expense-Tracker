// users.test.js
const request = require('supertest');
const { app } = require('./setup');

describe('Users API', () => {
  const testUserId = '12345';  // Valid ID: at least 5 digits
  let createdUser;

  describe('POST /api/users', () => {
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

      createdUser = response.body; // Save it for GET test later
    });

    it('should fail if ID is invalid', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          id: '123', // Less than 5 digits => Error
          first_name: 'Invalid',
          last_name: 'User',
          birthday: '1990-01-01',
          marital_status: 'single'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/Invalid ID/);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user details for a valid ID', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(testUserId);
      expect(response.body).toHaveProperty('total_expenses');
    });

    it('should return 404 for non-existing user', async () => {
      const response = await request(app).get('/api/users/99999');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toMatch(/User not found/);
    });
  });
});
