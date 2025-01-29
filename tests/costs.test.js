const request = require('supertest');
const { app } = require('./setup');
const Cost = require('../models/cost');

describe('POST /api/add', () => {
  beforeEach(async () => {
    await Cost.deleteMany({});
  });

  it('should add a new cost item', async () => {
    const costData = {
      description: 'Test expense',
      category: 'food',
      userid: '123123',
      sum: 50,
      date: new Date('2024-03-15')
    };

    const response = await request(app)
      .post('/api/add')
      .send(costData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe(costData.description);
    expect(response.body.category).toBe(costData.category);
    expect(response.body.userid).toBe(costData.userid);
    expect(response.body.sum).toBe(costData.sum);
  });

  it('should fail with invalid category', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'invalid',
        userid: '123123',
        sum: 50
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail with missing required fields', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should use current date if date is not provided', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 50
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('date');
    expect(new Date(response.body.date)).toBeInstanceOf(Date);
  });
});
