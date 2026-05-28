const express = require('express');
const db = require('./config/db');

const app = express();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});