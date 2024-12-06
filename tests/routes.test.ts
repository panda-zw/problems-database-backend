import request from 'supertest';
import app from '../src/server'; // Import app instance
import mongoose from 'mongoose';
import Problem from '../src/models/Problem';

describe('GET /api/problems', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  beforeEach(async () => {
    // Seed database with dummy data
    await Problem.insertMany(
      Array.from({ length: 25 }, (_, i) => ({
        problem_name: `Problem ${i + 1}`,
        sector: 'Test Sector',
        problem_description: `Description ${i + 1}`,
        solution_name: `Solution ${i + 1}`,
      }))
    );
  });

  afterEach(async () => {
    await Problem.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return paginated results event without params', async () => {
    const response = await request(app).get('/api/problems');
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(response.body.data).toHaveLength(10);
  });

  it('should return paginated results', async () => {
    const response = await request(app).get('/api/problems?page=2&limit=5');
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(2);
    expect(response.body.limit).toBe(5);
    expect(response.body.data).toHaveLength(5);
  });

  it('should return default pagination when no parameters are provided', async () => {
    const response = await request(app).get('/api/problems');
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(10);
    expect(response.body.data).toHaveLength(10);
  });
});
