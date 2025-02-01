/**
 * @module tests/costs
 * @description Test suite for expense-related API endpoints
 */

const request = require('supertest');
const { app } = require('./setup');

describe('Costs API', () => {
  /* Test user ID for expense association */
  const testUserId = '54321';
  
  /**
   * Setup: Create a test user before running expense tests
   * @function beforeAll
   */
  beforeAll(async () => {
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

  /**
   * Test suite for expense creation endpoint
   * @group POST /api/add
   */
  describe('POST /api/add', () => {
    /* Test successful expense creation with valid data */
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

    /* Test validation of negative expense amounts */
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

    /* Test handling of expenses for non-existent users */
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

  /**
   * Test suite for expense retrieval endpoint
   * @group GET /api
   */
  describe('GET /api', () => {
    /* Test retrieval of all expenses */
    it('should get all costs', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      /* Verify previously created test expense exists */
      const pizzaCost = response.body.find(cost => cost.description === 'Pizza');
      expect(pizzaCost).toBeDefined();
    });
  });
});
