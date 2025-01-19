const request = require('supertest');
const app = require('../app');

describe('POST /api/add', () => {
  it('should add a new cost', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Groceries',
        category: 'Food',
        userid: '123',
        sum: 200,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.description).toBe('Groceries');
  });
});