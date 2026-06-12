jest.mock('../js/config/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../js/config/db');
const app = require('../js/app');

describe('POST /auth/register', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('rejects a missing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'lorenzo', password: 'azerty12' });

    expect(res.status).toBe(400);
  });

  it('rejects a password without a digit', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'lorenzo', email: 'lorenzo@ymmo.fr', password: 'azertyazerty' });

    expect(res.status).toBe(400);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'lorenzo', email: 'lorenzo@ymmo.fr', password: 'az1' });

    expect(res.status).toBe(400);
  });

  it('creates a new account with valid data', async () => {
    db.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 42 }]);

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'lorenzo', email: 'lorenzo@ymmo.fr', password: 'azerty12' });

    expect(res.status).toBe(201);
    expect(res.body.user.user_id).toBe(42);
    expect(res.body.user.role).toBe('acheteur');
  });
});