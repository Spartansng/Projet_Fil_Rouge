const express = require('express');
const db = require('./config/db');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API ymmo fonctionne' });
});

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});