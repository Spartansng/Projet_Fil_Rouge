const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');

const app = express();

// Sécurité headers HTTP
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting sur les routes d'auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes.' },
});

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authLimiter, authRoutes);

const propertyRoutes = require('./routes/propertyRoutes');
app.use('/properties', propertyRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/appointments', appointmentRoutes);

const agencyRoutes = require('./routes/agencyRoutes');
app.use('/agencies', agencyRoutes);

const referenceRoutes = require('./routes/referenceRoutes');
app.use('/references', referenceRoutes);

app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});