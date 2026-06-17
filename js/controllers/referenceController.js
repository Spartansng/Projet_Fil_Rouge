const db = require('../config/db');

const getAllTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM property_types ORDER BY name ASC');
    return res.status(200).json({ message: 'Types récupérés.', count: rows.length, data: rows });
  } catch (err) {
    console.error('Erreur getAllTypes:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createType = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Le champ name est obligatoire.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO property_types (name) VALUES (?)',
      [name.trim()]
    );
    const [created] = await db.query(
      'SELECT * FROM property_types WHERE type_id = ?',
      [result.insertId]
    );
    return res.status(201).json({ message: 'Type créé.', data: created[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ce type existe déjà.' });
    }
    console.error('Erreur createType:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Le champ name est obligatoire.' });
  }

  try {
    const [existing] = await db.query(
      'SELECT type_id FROM property_types WHERE type_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Type introuvable.' });
    }

    await db.query(
      'UPDATE property_types SET name = ? WHERE type_id = ?',
      [name.trim(), id]
    );
    const [updated] = await db.query(
      'SELECT * FROM property_types WHERE type_id = ?',
      [id]
    );
    return res.status(200).json({ message: 'Type mis à jour.', data: updated[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ce nom est déjà utilisé.' });
    }
    console.error('Erreur updateType:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteType = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT type_id FROM property_types WHERE type_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Type introuvable.' });
    }

    await db.query('DELETE FROM property_types WHERE type_id = ?', [id]);
    return res.status(200).json({ message: `Type #${id} supprimé.` });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'Impossible de supprimer : ce type est utilisé par des biens.' });
    }
    console.error('Erreur deleteType:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};



const getAllStatus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM property_status ORDER BY name ASC');
    return res.status(200).json({ message: 'Statuts récupérés.', count: rows.length, data: rows });
  } catch (err) {
    console.error('Erreur getAllStatus:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const createStatus = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Le champ name est obligatoire.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO property_status (name) VALUES (?)',
      [name.trim()]
    );
    const [created] = await db.query(
      'SELECT * FROM property_status WHERE status_id = ?',
      [result.insertId]
    );
    return res.status(201).json({ message: 'Statut créé.', data: created[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ce statut existe déjà.' });
    }
    console.error('Erreur createStatus:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Le champ name est obligatoire.' });
  }

  try {
    const [existing] = await db.query(
      'SELECT status_id FROM property_status WHERE status_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Statut introuvable.' });
    }

    await db.query(
      'UPDATE property_status SET name = ? WHERE status_id = ?',
      [name.trim(), id]
    );
    const [updated] = await db.query(
      'SELECT * FROM property_status WHERE status_id = ?',
      [id]
    );
    return res.status(200).json({ message: 'Statut mis à jour.', data: updated[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ce nom est déjà utilisé.' });
    }
    console.error('Erreur updateStatus:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT status_id FROM property_status WHERE status_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Statut introuvable.' });
    }

    await db.query('DELETE FROM property_status WHERE status_id = ?', [id]);
    return res.status(200).json({ message: `Statut #${id} supprimé.` });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'Impossible de supprimer : ce statut est utilisé par des biens.' });
    }
    console.error('Erreur deleteStatus:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getAllTypes,  createType,  updateType,  deleteType,
  getAllStatus, createStatus, updateStatus, deleteStatus,
};