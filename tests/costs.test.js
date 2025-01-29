const request = require('supertest');
const { app } = require('./setup');

describe('POST /api/add', () => {
  it('should add a new cost item with all valid fields', async () => {
    const testDate = new Date('2024-03-15');
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 50,
        date: testDate
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe('Test expense');
    expect(response.body.category).toBe('food');
    expect(response.body.userid).toBe('123123');
    expect(response.body.sum).toBe(50);
    expect(new Date(response.body.date)).toEqual(testDate);
  });

  it('should add a cost item without date and use current date', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 50
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.date).toBeDefined();
    expect(new Date(response.body.date)).toBeInstanceOf(Date);
  });

  it('should fail when sum is negative', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: -50
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/positive number/i);
  });

  it('should fail when sum is zero', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 0
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/positive number/i);
  });

  it('should fail when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense'
        // missing category, userid, and sum
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/required fields/i);
  });

  it('should fail when description is empty', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: '',
        category: 'food',
        userid: '123123',
        sum: 50
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail when category is empty', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: '',
        userid: '123123',
        sum: 50
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should trim whitespace from text fields', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: '  Test expense  ',
        category: '  food  ',
        userid: '  123123  ',
        sum: 50
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.description).toBe('Test expense');
    expect(response.body.category).toBe('food');
    expect(response.body.userid).toBe('123123');
  });

  it('should fail when date is invalid', async () => {
    const response = await request(app)
      .post('/api/add')
      .send({
        description: 'Test expense',
        category: 'food',
        userid: '123123',
        sum: 50,
        date: 'invalid-date'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/date/i);
  });
});
