const express = require('express');
const db = require('./config/db');

const app = express();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

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