const request = require('supertest');
const app = require('../app');

describe('GET /api/users/:id', () => {
  it('should return user details and total costs', async () => {
    const response = await request(app).get('/api/users/123');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe('123');
  });
});