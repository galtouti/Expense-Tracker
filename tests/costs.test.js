const request = require('supertest');
const { app, server } = require('./setup');

describe('POST /api/add', () => {
  it('should add a new cost item', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`)
      .post('/api/add')
      .send({
        description: 'Lunch',
        category: 'food',
        userid: '123123',
        sum: 50,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe('Lunch');
    expect(response.body.category).toBe('food');
    expect(response.body.userid).toBe('123123');
    expect(response.body.sum).toBe(50);
  });
});
