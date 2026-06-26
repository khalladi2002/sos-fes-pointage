require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const secteurRoutes = require('./routes/secteurRoutes');
const agentRoutes = require('./routes/agentRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const statsRoutes = require('./routes/statsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'SOS Fès - Pointage API' }));

app.use('/api/auth', authRoutes);
app.use('/api/secteurs', secteurRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Gestion des erreurs 404
app.use((req, res) => res.status(404).json({ message: 'Route introuvable.' }));

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur interne du serveur.', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur SOS Fès démarré sur le port ${PORT}`));
