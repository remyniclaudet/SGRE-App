const Reservation = require('../models/Reservation');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');
const User = require('../models/User');

const reservationController = {
    createReservation: async (req, res) => {
        try {
            const { resource_id, start_date, end_date, notes, event_id } = req.body;
            
            // Validation des données
            if (!resource_id || !start_date || !end_date) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Les champs ressource, date de début et date de fin sont obligatoires' 
                });
            }

            // Vérifier la disponibilité de la ressource
            const resource = await Resource.findById(resource_id);
            if (!resource) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Ressource non trouvée' 
                });
            }
            
            if (resource.status !== 'available') {
                return res.status(400).json({ 
                    success: false,
                    message: 'Ressource non disponible' 
                });
            }

            // Vérifier si la ressource est déjà réservée pour cette période
            const existingReservations = await Reservation.findByResource(resource_id);
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            
            const hasConflict = existingReservations.some(reservation => {
                if (reservation.status !== 'confirmed' && reservation.status !== 'pending') return false;
                
                const resStart = new Date(reservation.start_date);
                const resEnd = new Date(reservation.end_date);
                
                return (startDate < resEnd && endDate > resStart);
            });

            if (hasConflict) {
                return res.status(400).json({ 
                    success: false,
                    message: 'La ressource est déjà réservée pour cette période' 
                });
            }

            // Créer la réservation
            const reservationId = await Reservation.create({
                user_id: req.userId,
                resource_id,
                event_id: event_id || null,
                start_date: startDate,
                end_date: endDate,
                status: 'pending',
                notes: notes || ''
            });

            // Récupérer les informations pour la notification
            const user = await User.findById(req.userId);
            
            // Créer une notification pour les managers
            const managers = await User.findAll();
            const managerUsers = managers.filter(m => m.role === 'manager');
            
            for (const manager of managerUsers) {
                await Notification.create({
                    user_id: manager.id,
                    title: 'Nouvelle réservation',
                    message: `${user.name} a effectué une nouvelle réservation pour ${resource.name}`,
                    type: 'info',
                    related_type: 'reservation',
                    related_id: reservationId
                });
            }

            // Notification pour l'utilisateur
            await Notification.create({
                user_id: req.userId,
                title: 'Réservation enregistrée',
                message: `Votre réservation pour ${resource.name} a été enregistrée et est en attente de confirmation`,
                type: 'info',
                related_type: 'reservation',
                related_id: reservationId
            });

            res.json({
                success: true,
                message: 'Réservation créée avec succès. En attente de confirmation.',
                reservationId
            });
            
        } catch (error) {
            console.error('Create reservation error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur lors de la création de la réservation' 
            });
        }
    },

    getAllReservations: async (req, res) => {
        try {
            const reservations = await Reservation.findAll();
            res.json({
                success: true,
                reservations
            });
        } catch (error) {
            console.error('Get reservations error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    getMyReservations: async (req, res) => {
        try {
            const reservations = await Reservation.findByUser(req.userId);
            res.json({
                success: true,
                reservations
            });
        } catch (error) {
            console.error('Get my reservations error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    getReservationById: async (req, res) => {
        try {
            const { id } = req.params;
            const reservation = await Reservation.findById(id);
            
            if (!reservation) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Réservation non trouvée' 
                });
            }
            
            // Vérifier l'accès
            if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== req.userId) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Accès non autorisé' 
                });
            }
            
            res.json({
                success: true,
                reservation
            });
            
        } catch (error) {
            console.error('Get reservation error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    updateReservationStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const validStatuses = ['confirmed', 'rejected', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Statut invalide' 
                });
            }
            
            await Reservation.update(id, { status });
            
            // Récupérer la réservation pour créer une notification
            const reservation = await Reservation.findById(id);
            if (reservation) {
                await Notification.create({
                    user_id: reservation.user_id,
                    title: 'Statut de réservation mis à jour',
                    message: `Votre réservation #${id} a été ${status}`,
                    type: status === 'confirmed' ? 'success' : 'warning',
                    related_type: 'reservation',
                    related_id: id
                });
            }
            
            res.json({
                success: true,
                message: `Réservation ${status} avec succès`
            });
            
        } catch (error) {
            console.error('Update reservation status error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    cancelReservation: async (req, res) => {
        try {
            const { id } = req.params;
            
            const reservation = await Reservation.findById(id);
            if (!reservation) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Réservation non trouvée' 
                });
            }
            
            // Vérifier que l'utilisateur peut annuler cette réservation
            if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== req.userId) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Non autorisé' 
                });
            }
            
            await Reservation.update(id, { status: 'cancelled' });
            
            res.json({
                success: true,
                message: 'Réservation annulée avec succès'
            });
            
        } catch (error) {
            console.error('Cancel reservation error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    getPendingReservations: async (req, res) => {
        try {
            const reservations = await Reservation.getPending();
            res.json({
                success: true,
                reservations
            });
        } catch (error) {
            console.error('Get pending reservations error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    },

    checkAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { start_date, end_date } = req.query;
            
            if (!start_date || !end_date) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Les dates de début et de fin sont requises' 
                });
            }
            
            const resource = await Resource.findById(id);
            if (!resource || resource.status !== 'available') {
                return res.json({
                    success: false,
                    available: false,
                    message: 'Ressource non disponible'
                });
            }
            
            // Vérifier les réservations existantes
            const reservations = await Reservation.findByResource(id);
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            
            const hasConflict = reservations.some(reservation => {
                if (reservation.status !== 'confirmed') return false;
                
                const resStart = new Date(reservation.start_date);
                const resEnd = new Date(reservation.end_date);
                
                return (startDate < resEnd && endDate > resStart);
            });
            
            res.json({
                success: true,
                available: !hasConflict,
                message: hasConflict ? 'Ressource déjà réservée pour cette période' : 'Disponible'
            });
            
        } catch (error) {
            console.error('Check availability error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erreur serveur lors de la vérification de disponibilité' 
            });
        }
    }
};

module.exports = reservationController;