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
        res.status(500).json({ success: false, message: 'Erreur serveur' });
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
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);
        
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
        }
        
        if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== req.userId) {
            return res.status(403).json({ success: false, message: 'Accès non autorisé' });
        }
        
        res.json({
            success: true,
            reservation
        });
        
    } catch (error) {
        console.error('Get reservation error:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { resource_id, start_date, end_date, notes, event_id } = req.body;
        
        // Validation des données
        if (!resource_id || !start_date || !end_date) {
            return res.status(400).json({ 
                message: 'Les champs ressource, date de début et date de fin sont obligatoires' 
            });
        }

        // Vérifier la disponibilité de la ressource
        const resource = await Resource.findById(resource_id);
        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }
        
        if (resource.status !== 'available') {
            return res.status(400).json({ message: 'Ressource non disponible' });
        }

        // Vérifier si la ressource est déjà réservée pour cette période
        const existingReservations = await Reservation.findByResource(resource_id);
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        const hasConflict = existingReservations.some(reservation => {
            if (reservation.status !== 'confirmed') return false;
            
            const resStart = new Date(reservation.start_date);
            const resEnd = new Date(reservation.end_date);
            
            return (startDate < resEnd && endDate > resStart);
        });

        if (hasConflict) {
            return res.status(400).json({ 
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
        res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation' });
    }
};
exports.updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['confirmed', 'rejected', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Statut invalide' });
        }
        
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
        }

        await Reservation.update(id, { status });
        
        // Notifier l'utilisateur
        const statusMsg = {
            confirmed: 'confirmée',
            rejected: 'rejetée',
            cancelled: 'annulée'
        };

        await Notification.create({
            user_id: reservation.user_id,
            title: 'Réservation ' + statusMsg[status],
            message: `Votre réservation #${id} a été ${statusMsg[status]}`,
            type: status === 'confirmed' ? 'success' : 'warning',
            related_type: 'reservation',
            related_id: id
        });
        
        res.json({
            success: true,
            message: `Réservation ${statusMsg[status]} avec succès`
        });
        
    } catch (error) {
        console.error('Update reservation status error:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
        }
        
        if (req.userRole !== 'admin' && req.userRole !== 'manager' && reservation.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }
        
        await Reservation.update(id, { status: 'cancelled' });
        
        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });
        
    } catch (error) {
        console.error('Cancel reservation error:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
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
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};