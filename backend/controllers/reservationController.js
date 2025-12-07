const Reservation = require('../models/Reservation');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Get reservations error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findByUser(req.userId);
        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Get my reservations error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        // Vérifier l'accès
        if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== req.userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        
        res.json({
            success: true,
            reservation
        });
        
    } catch (error) {
        console.error('Get reservation error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { resource_id, event_id, start_date, end_date, notes } = req.body;
        
        // Vérifier la disponibilité de la ressource
        const resource = await Resource.findById(resource_id);
        if (!resource || resource.status !== 'available') {
            return res.status(400).json({ message: 'Ressource non disponible' });
        }
        
        const reservationId = await Reservation.create({
            user_id: req.userId,
            resource_id,
            event_id: event_id || null,
            start_date,
            end_date,
            status: 'pending',
            notes
        });
        
        // Créer une notification pour les managers
        const notification = await Notification.create({
            user_id: req.userRole === 'manager' ? req.userId : 2, // ID du manager par défaut
            title: 'Nouvelle réservation',
            message: `Une nouvelle réservation a été effectuée pour ${resource.name}`,
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
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['confirmed', 'rejected', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Statut invalide' });
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
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        // Vérifier que l'utilisateur peut annuler cette réservation
        if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== req.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }
        
        await Reservation.update(id, { status: 'cancelled' });
        
        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });
        
    } catch (error) {
        console.error('Cancel reservation error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getPendingReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getPending();
        res.json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error('Get pending reservations error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};