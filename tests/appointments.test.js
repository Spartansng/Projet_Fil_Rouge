jest.mock('../js/config/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../js/config/db');
const app = require('../js/app');
const { buildToken } = require('./helpers/tokens');

describe('GET /appointments', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('rejects requests without a token', async () => {
    const res = await request(app).get('/appointments');
    expect(res.status).toBe(401);
  });

  it('only returns the current user appointments for a buyer', async () => {
    const token = buildToken({ user_id: 1, email: 'buyer@ymmo.fr', role: 'acheteur', agency_id: null });

    db.query.mockResolvedValueOnce([[
      { appointment_id: 10, user_id: 1, property_id: 5, appointment_date: '2026-07-01 10:00:00', status: 'pending', message: null },
    ]]);

    const res = await request(app)
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/WHERE a.user_id = \?/);
    expect(db.query.mock.calls[0][1]).toEqual([1]);
    expect(res.body).toHaveLength(1);
  });

  it('returns every appointment for an agent', async () => {
    const token = buildToken({ user_id: 99, email: 'agent@ymmo.fr', role: 'agent', agency_id: 1 });

    db.query.mockResolvedValueOnce([[
      { appointment_id: 10, user_id: 1, property_id: 5 },
      { appointment_id: 11, user_id: 2, property_id: 6 },
    ]]);

    const res = await request(app)
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).not.toMatch(/WHERE/);
    expect(res.body).toHaveLength(2);
  });
});

describe('PUT /appointments/:id', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('rejects a buyer updating another user appointment', async () => {
    const token = buildToken({ user_id: 1, email: 'buyer@ymmo.fr', role: 'acheteur', agency_id: null });

    db.query.mockResolvedValueOnce([[
      { appointment_id: 10, user_id: 2, property_id: 5, status: 'pending' },
    ]]);

    const res = await request(app)
      .put('/appointments/10')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Je décale le rendez-vous' });

    expect(res.status).toBe(403);
  });

  it('rejects a buyer trying to change the status', async () => {
    const token = buildToken({ user_id: 1, email: 'buyer@ymmo.fr', role: 'acheteur', agency_id: null });

    db.query.mockResolvedValueOnce([[
      { appointment_id: 10, user_id: 1, property_id: 5, status: 'pending' },
    ]]);

    const res = await request(app)
      .put('/appointments/10')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(400);
  });

  it('allows an agent to confirm an appointment', async () => {
    const token = buildToken({ user_id: 99, email: 'agent@ymmo.fr', role: 'agent', agency_id: 1 });

    db.query
      .mockResolvedValueOnce([[
        { appointment_id: 10, user_id: 1, property_id: 5, status: 'pending' },
      ]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[
        { appointment_id: 10, user_id: 1, property_id: 5, status: 'confirmed' },
      ]]);

    const res = await request(app)
      .put('/appointments/10')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });
});