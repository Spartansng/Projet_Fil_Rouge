const jwt = require('jsonwebtoken');

const buildToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

module.exports = { buildToken };