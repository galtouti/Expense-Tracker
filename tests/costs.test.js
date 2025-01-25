const request = require('supertest');
const { app } = require('./setup');

describe('POST /api/add', () => {
  it('should add a new cost item', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 50,
        date: new Date('2024-03-15')
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe('Test expense');
    expect(response.body.category).toBe('food');
    expect(response.body.userid).toBe('123123');
    expect(response.body.sum).toBe(50);
  });
});
