// costs.test.js
const request = require('supertest');
const { app } = require('./setup');

describe('Costs API', () => {
  const testUserId = '54321'; // Create such a user for tests
  
  beforeAll(async () => {
    // First, create a user to associate expenses
    await request(app)
      .post('/api/users')
      .send({
        id: testUserId,
        first_name: 'Cost',
        last_name: 'Tester',
        birthday: '2000-01-01',
        marital_status: 'single'
      });
  });

  describe('POST /api/add', () => {
    it('should add a new cost with valid data', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({
          description: 'Pizza',
          category: 'food',
          userid: testUserId,
          sum: 50,
          date: '2023-10-01'
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.description).toBe('Pizza');
      expect(response.body.sum).toBe(50);
    });

    it('should fail if sum is negative', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({
          description: 'Bad Data',
          category: 'food',
          userid: testUserId,
          sum: -10
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/Sum must be a positive number/);
    });

    it('should fail if user does not exist', async () => {
      const response = await request(app)
        .post('/api/add')
        .send({
          description: 'Unknown User Cost',
          category: 'food',
          userid: '99999',
          sum: 20
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toMatch(/User does not exist/);
    });
  });

  describe('GET /api', () => {
    it('should get all costs', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // Ensure there is at least one expense added
      const pizzaCost = response.body.find(cost => cost.description === 'Pizza');
      expect(pizzaCost).toBeDefined();
    });
  });
});
