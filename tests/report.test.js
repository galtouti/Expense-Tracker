// report.test.js
const request = require('supertest');
const { app } = require('./setup');

describe('Report API', () => {
  let testUserId = '77777';

  beforeAll(async () => {
    // Create a user for tests
    await request(app)
      .post('/api/users')
      .send({
        id: testUserId,
        first_name: 'Report',
        last_name: 'User',
        birthday: '1995-05-05',
        marital_status: 'single'
      });

    // Add some expenses to him
    await request(app)
      .post('/api/add')
      .send({
        description: 'Rent',
        category: 'housing',
        userid: testUserId,
        sum: 1000,
        date: '2024-01-10'
      });

    await request(app)
      .post('/api/add')
      .send({
        description: 'Gym',
        category: 'sport',
        userid: testUserId,
        sum: 150,
        date: '2024-01-15'
      });
  });

  it('should return a monthly report for a given user, year and month', async () => {
    const response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2024', month: '1' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(testUserId);
    expect(response.body.month).toBe(1);
    expect(response.body.year).toBe(2024);

    // Check for categories like housing, sport
    const housingCategory = response.body.categories.find(cat => cat.category === 'housing');
    const sportCategory = response.body.categories.find(cat => cat.category === 'sport');
    expect(housingCategory).toBeDefined();
    expect(sportCategory).toBeDefined();
    expect(housingCategory.expensesCount).toBe(1);
    expect(sportCategory.expensesCount).toBe(1);
  });

  it('should return 404 if no data found for that month', async () => {
    const response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2022', month: '12' }); // No expenses on this date
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toMatch(/No data/);
  });

  it('should fail if missing parameters', async () => {
    // Without year
    let response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, month: '1' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing year/);

    // Without month
    response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2024' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing month/);
  });
});
