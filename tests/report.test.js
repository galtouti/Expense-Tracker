const request = require('supertest');
const { app, server } = require('./setup');

describe('GET /api/report', () => {
  it('should return costs for a specific user, year, and month', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`).get('/api/report?id=123123&year=2025&month=1');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('userid', '123123');
      expect(response.body[0]).toHaveProperty('sum');
    }
  });

  it('should return an error for missing parameters', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`).get('/api/report');
    expect(response.statusCode).toBe(400); // Match the API's behavior
    expect(response.body).toHaveProperty('error');
  });
});
