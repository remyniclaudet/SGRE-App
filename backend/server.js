/**
 * Serveur principal SGRE-App
 * Point d'entrée de l'application backend
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const eventRoutes = require('./routes/events');
const reservationRoutes = require('./routes/reservations');
const notificationRoutes = require('./routes/notifications');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
}));

// Dossier pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);

// Route de test
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SGRE API is running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all 404 handler (mounted at default '/' so no path-to-regexp '*' is used)
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📚 API disponible sur http://localhost:${PORT}/api/v1`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;