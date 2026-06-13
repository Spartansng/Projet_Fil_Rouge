jest.mock('../js/config/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../js/config/db');
const app = require('../js/app');
const { buildToken } = require('./helpers/tokens');

const XSS_PAYLOAD = '<script>alert(1)</script>';
const XSS_ESCAPED = '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;';

describe('Protection XSS - échappement des entrées utilisateur', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('échappe une balise <script> dans le username lors de l\'inscription', async () => {
    db.query
      .mockResolvedValueOnce([[]]) // SELECT user_id FROM users WHERE email = ?
      .mockResolvedValueOnce([{ insertId: 1 }]); // INSERT INTO users ...

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: XSS_PAYLOAD,
        email: 'xss@ymmo.fr',
        password: 'azerty12',
      });

    expect(res.status).toBe(201);

    // Le payload est neutralisé avant d'être inséré en base
    const insertCall = db.query.mock.calls[1];
    const insertedUsername = insertCall[1][0];
    expect(insertedUsername).not.toContain('<script>');
    expect(insertedUsername).toBe(XSS_ESCAPED);

    // La valeur renvoyée au client est également échappée
    expect(res.body.user.username).not.toContain('<script>');
  });

  it('échappe une balise <script> dans le titre et la description d\'un bien', async () => {
    const token = buildToken({ user_id: 1, email: 'agent@ymmo.fr', role: 'agent', agency_id: 1 });

    db.query
      .mockResolvedValueOnce([{ insertId: 42 }]) // INSERT INTO properties ...
      .mockResolvedValueOnce([[{ property_id: 42, title: XSS_ESCAPED }]]); // SELECT * WHERE property_id = ?

    const res = await request(app)
      .post('/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: XSS_PAYLOAD,
        description: '<img src=x onerror=alert(2)>',
        price: 100000,
        city: 'Aix-en-Provence',
        address: '1 rue de la Paix',
        district: 'Centre',
        type_id: 1,
        agency_id: 1,
        status_id: 1,
      });

    expect(res.status).toBe(201);

    const insertCall = db.query.mock.calls[0];
    const [title, description] = insertCall[1];

    expect(title).not.toContain('<script>');
    expect(title).toBe(XSS_ESCAPED);

    // Les chevrons sont encodés : le payload ne peut plus être interprété comme du HTML/JS
    expect(description).not.toContain('<img');
    expect(description).toContain('&lt;img');
    expect(description).toContain('&gt;');
  });

  it('échappe une balise <script> dans le message d\'un rendez-vous', async () => {
    const token = buildToken({ user_id: 1, email: 'buyer@ymmo.fr', role: 'acheteur', agency_id: null });

    db.query
      .mockResolvedValueOnce([[{ property_id: 5 }]]) // SELECT property_id FROM properties WHERE property_id = ?
      .mockResolvedValueOnce([{ insertId: 10 }]) // INSERT INTO appointments ...
      .mockResolvedValueOnce([[{ appointment_id: 10, message: XSS_ESCAPED }]]); // SELECT * WHERE appointment_id = ?

    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        property_id: 5,
        appointment_date: futureDate,
        message: XSS_PAYLOAD,
      });

    expect(res.status).toBe(201);

    const insertCall = db.query.mock.calls[1];
    const insertedMessage = insertCall[1][4]; // user_id, property_id, appointment_date, status, message
    expect(insertedMessage).not.toContain('<script>');
    expect(insertedMessage).toBe(XSS_ESCAPED);
  });

  it('échappe une balise <script> dans le nom d\'une agence', async () => {
    const token = buildToken({ user_id: 1, email: 'admin@ymmo.fr', role: 'admin', agency_id: null });

    db.query
      .mockResolvedValueOnce([{ insertId: 7 }]) // INSERT INTO agencies ...
      .mockResolvedValueOnce([[{ agency_id: 7, name: XSS_ESCAPED }]]); // SELECT * WHERE agency_id = ?

    const res = await request(app)
      .post('/agencies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: XSS_PAYLOAD,
        city: 'Aix-en-Provence',
      });

    expect(res.status).toBe(201);

    const insertCall = db.query.mock.calls[0];
    const insertedName = insertCall[1][0];
    expect(insertedName).not.toContain('<script>');
    expect(insertedName).toBe(XSS_ESCAPED);
  });

  it('rejette / échappe une tentative de XSS dans le champ name d\'un type de bien', async () => {
    const token = buildToken({ user_id: 1, email: 'admin@ymmo.fr', role: 'admin', agency_id: null });

    db.query
      .mockResolvedValueOnce([{ insertId: 3 }]) // INSERT INTO property_types ...
      .mockResolvedValueOnce([[{ type_id: 3, name: XSS_ESCAPED }]]); // SELECT * WHERE type_id = ?

    const res = await request(app)
      .post('/references/property-types')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '<svg onload=alert(3)>' });

    expect(res.status).toBe(201);

    const insertCall = db.query.mock.calls[0];
    const insertedName = insertCall[1][0];
    expect(insertedName).not.toMatch(/<svg/i);
    expect(insertedName).toContain('&lt;svg');
    expect(insertedName).toContain('&gt;');
  });
});
