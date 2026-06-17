jest.mock('../js/config/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../js/config/db');
const app = require('../js/app');
const { buildToken } = require('./helpers/tokens');

describe('POST /references/property-types', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('rejects requests without a token', async () => {
    const res = await request(app)
      .post('/references/property-types')
      .send({ name: 'Loft' });

    expect(res.status).toBe(401);
  });

  it('rejects a non-admin user (acheteur)', async () => {
    const token = buildToken({ user_id: 1, email: 'buyer@ymmo.fr', role: 'acheteur', agency_id: null });

    const res = await request(app)
      .post('/references/property-types')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Loft' });

    expect(res.status).toBe(403);
  });

  it('allows an admin user', async () => {
    const token = buildToken({ user_id: 2, email: 'admin@ymmo.fr', role: 'admin', agency_id: null });

    db.query
      .mockResolvedValueOnce([{ insertId: 7 }])
      .mockResolvedValueOnce([[{ type_id: 7, name: 'Loft' }]]);

    const res = await request(app)
      .post('/references/property-types')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Loft' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Loft');
  });
});