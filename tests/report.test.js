const request = require('supertest');
const app = require('../app');

describe('GET /api/report', () => {
  it('should return a monthly report for a user', async () => {
    const response = await request(app)
      .get('/api/report?id=123&year=2025&month=1');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});