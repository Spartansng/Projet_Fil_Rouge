const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(helmet());

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

module.exports = app;