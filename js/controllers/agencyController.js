const db = require('../config/db');

const REQUIRED_FIELDS = ['name', 'city'];
const ALLOWED_FIELDS  = ['name', 'city', 'address'];


const getAllAgencies = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM agencies ORDER BY name ASC'
    );

    return res.status(200).json({
      message: 'Liste des agences récupérée.',
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('Erreur getAllAgencies:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


const getAgencyById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM agencies WHERE agency_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Agence introuvable.' });
    }

    return res.status(200).json({
      message: 'Agence récupérée.',
      data: rows[0],
    });
  } catch (err) {
    console.error('Erreur getAgencyById:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


const createAgency = async (req, res) => {
  const body = req.body;

  const missing = REQUIRED_FIELDS.filter(f => !body[f] || body[f].toString().trim() === '');
  if (missing.length > 0) {
    return res.status(400).json({
      message: `Champ(s) obligatoire(s) manquant(s) : ${missing.join(', ')}`,
    });
  }

  const { name, city, address = null } = body;

  try {
    const [result] = await db.query(
      'INSERT INTO agencies (name, city, address) VALUES (?, ?, ?)',
      [name.trim(), city.trim(), address]
    );

    const [created] = await db.query(
      'SELECT * FROM agencies WHERE agency_id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Agence créée avec succès.',
      data: created[0],
    });
  } catch (err) {
    console.error('Erreur createAgency:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


const updateAgency = async (req, res) => {
  const { id } = req.params;
  const body   = req.body;

  try {
    const [existing] = await db.query(
      'SELECT agency_id FROM agencies WHERE agency_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agence introuvable.' });
    }

    const fieldsToUpdate = ALLOWED_FIELDS.filter(f => f in body);

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide à mettre à jour.' });
    }

    const setClauses = fieldsToUpdate.map(f => `${f} = ?`).join(', ');
    const values     = fieldsToUpdate.map(f =>
      typeof body[f] === 'string' ? body[f].trim() : body[f]
    );

    await db.query(
      `UPDATE agencies SET ${setClauses} WHERE agency_id = ?`,
      [...values, id]
    );

    const [updated] = await db.query(
      'SELECT * FROM agencies WHERE agency_id = ?',
      [id]
    );

    return res.status(200).json({
      message: 'Agence mise à jour.',
      data: updated[0],
    });
  } catch (err) {
    console.error('Erreur updateAgency:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


const deleteAgency = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT agency_id FROM agencies WHERE agency_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agence introuvable.' });
    }

    await db.query('DELETE FROM agencies WHERE agency_id = ?', [id]);

    return res.status(200).json({
      message: `Agence #${id} supprimée avec succès.`,
    });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'Impossible de supprimer cette agence : elle est liée à des biens ou des utilisateurs.',
      });
    }

    console.error('Erreur deleteAgency:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  deleteAgency,
};