const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Vérification au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur connexion DB :', err.message);
    process.exit(1);
  }
  console.log('MySQL connecté');
  connection.release();
});

module.exports = pool.promise();