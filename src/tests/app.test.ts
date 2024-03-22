import request from 'supertest';
import { app, server } from '../app';

jest.mock('../services/queueService', () => ({
  clearQueue: jest.fn().mockResolvedValue(undefined),
}));

describe('API Routes', () => {
  it('GET /api', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message', 'General Kenobi. You are a bold one!');
  });

  it('Non-existing route', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('code', 404);
  });
});

afterAll((done) => {
  jest.restoreAllMocks();
  server.close(done);
});
