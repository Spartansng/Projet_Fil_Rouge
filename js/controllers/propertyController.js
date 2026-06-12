const db = require('../config/db');

const isAdmin = (user) => user.role === 'admin';

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.property_id, p.title, p.description, p.price, p.surface,
              p.city, p.postal_code, p.address, p.district,
              p.type_id, p.agency_id, p.status_id,
              p.created_at, p.updated_at
       FROM properties p
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getAll properties:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.property_id, p.title, p.description, p.price, p.surface,
              p.city, p.postal_code, p.address, p.district,
              p.type_id, p.agency_id, p.status_id,
              p.created_at, p.updated_at
       FROM properties p
       WHERE p.property_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bien immobilier introuvable.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getById properties:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const create = async (req, res) => {
  const { title, description, price, surface, city, postal_code, address, district, type_id, agency_id, status_id } = req.body;

  const effectiveAgencyId = isAdmin(req.user) ? agency_id : req.user.agency_id;

  const required = { title, price, city, address, district, type_id, agency_id: effectiveAgencyId, status_id };
  const missing = Object.keys(required).filter(k => !required[k] && required[k] !== 0);

  if (missing.length > 0) {
    return res.status(400).json({ message: 'Champs obligatoires manquants', fields: missing });
  }

  if (!isAdmin(req.user) && agency_id && Number(agency_id) !== Number(req.user.agency_id)) {
    return res.status(403).json({ message: "Accès refusé : vous ne pouvez créer un bien que pour votre propre agence." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO properties (title, description, price, surface, city, postal_code, address, district, type_id, agency_id, status_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description ?? null, price, surface ?? null, city, postal_code ?? null, address, district, type_id, effectiveAgencyId, status_id]
    );

    const [rows] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erreur create property:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const update = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bien immobilier introuvable.' });
    }

    const property = existing[0];

    if (!isAdmin(req.user) && property.agency_id !== req.user.agency_id) {
      return res.status(403).json({ message: 'Accès refusé : ce bien appartient à une autre agence.' });
    }

    const allowed = ['title', 'description', 'price', 'surface', 'city', 'postal_code', 'address', 'district', 'type_id', 'agency_id', 'status_id'];
    let fields = Object.keys(req.body).filter(k => allowed.includes(k));

    if (!isAdmin(req.user)) {
      fields = fields.filter(k => k !== 'agency_id');
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour.' });
    }

    const values = fields.map(k => req.body[k]);
    const setClause = fields.map(k => `${k} = ?`).join(', ');

    await db.query(
      `UPDATE properties SET ${setClause}, updated_at = NOW() WHERE property_id = ?`,
      [...values, req.params.id]
    );

    const [rows] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur update property:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const remove = async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bien immobilier introuvable.' });
    }

    const property = existing[0];

    if (!isAdmin(req.user) && property.agency_id !== req.user.agency_id) {
      return res.status(403).json({ message: 'Accès refusé : ce bien appartient à une autre agence.' });
    }

    await db.query('DELETE FROM properties WHERE property_id = ?', [req.params.id]);

    res.json({ message: 'Bien immobilier supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur remove property:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getAll, getById, create, update, remove };