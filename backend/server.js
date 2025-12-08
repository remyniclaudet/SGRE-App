const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware CORS avec configuration plus permissive
app.use(cors({
    origin: 'http://localhost:3000', // URL du frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// Middleware pour parser le JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const eventRoutes = require('./routes/events');
const reservationRoutes = require('./routes/reservations');
const notificationRoutes = require('./routes/notifications');
const configRoutes = require('./routes/config');
const categoryRoutes = require('./routes/categories');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/config', configRoutes);
app.use('/api/categories', categoryRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenue sur l\'API de gestion des ressources et événements',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            resources: '/api/resources',
            events: '/api/events',
            reservations: '/api/reservations'
        }
    });
});

// Route pour vérifier la santé de l'API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Ressources Management API'
    });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route non trouvée: ${req.method} ${req.url}`
    });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Point de santé: http://localhost:${PORT}/api/health`);
});