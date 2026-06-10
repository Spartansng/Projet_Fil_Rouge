const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.appointment_id, a.user_id, a.property_id, a.appointment_date,
              a.status, a.message, a.created_at, a.updated_at
       FROM appointments a
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getAll appointments:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.appointment_id, a.user_id, a.property_id, a.appointment_date,
              a.status, a.message, a.created_at, a.updated_at
       FROM appointments a
       WHERE a.appointment_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getById appointments:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const create = async (req, res) => {
  const { property_id, appointment_date, status, message } = req.body;
  const user_id = req.user.user_id;

  const required = { user_id, property_id, appointment_date };
  const missing = Object.keys(required).filter(k => !required[k] && required[k] !== 0);

  if (missing.length > 0) {
    return res.status(400).json({ message: 'Champs obligatoires manquants', fields: missing });
  }

  try {
    const [property] = await db.query(
      'SELECT property_id FROM properties WHERE property_id = ?',
      [property_id]
    );

    if (property.length === 0) {
      return res.status(404).json({ message: 'Bien immobilier introuvable.' });
    }

    const [result] = await db.query(
      `INSERT INTO appointments (user_id, property_id, appointment_date, status, message)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, property_id, appointment_date, status ?? 'pending', message ?? null]
    );

    const [rows] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erreur create appointment:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const update = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    }

    const allowed = ['appointment_date', 'status', 'message'];
    const fields = Object.keys(req.body).filter(k => allowed.includes(k));

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour.' });
    }

    const values = fields.map(k => req.body[k]);
    const setClause = fields.map(k => `${k} = ?`).join(', ');

    await db.query(
      `UPDATE appointments SET ${setClause}, updated_at = NOW() WHERE appointment_id = ?`,
      [...values, req.params.id]
    );

    const [rows] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur update appointment:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const remove = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    }

    await db.query('DELETE FROM appointments WHERE appointment_id = ?', [req.params.id]);

    res.json({ message: 'Rendez-vous supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur remove appointment:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getAll, getById, create, update, remove };