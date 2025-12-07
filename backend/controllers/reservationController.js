/**
 * Contrôleur de gestion des réservations
 */

const reservationModel = require('../models/reservationModel');
const auditModel = require('../models/auditModel');
const notificationUtils = require('../utils/notifications');

/**
 * Récupérer toutes les réservations
 */
exports.getAllReservations = async (req, res) => {
  try {
    const { status, resource_id, user_id, start_date, end_date } = req.query;
    
    const reservations = await reservationModel.getAllReservations({
      status,
      resource_id,
      user_id,
      start_date,
      end_date
    });

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer les réservations d'un utilisateur
 */
exports.getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier les permissions (soit l'utilisateur lui-même, soit admin/manager)
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && req.user.id != userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const reservations = await reservationModel.getUserReservations(userId);

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer une réservation par ID
 */
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationModel.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Créer une nouvelle réservation
 */
exports.createReservation = async (req, res) => {
  try {
    const {
      event_id,
      resource_id,
      start_at,
      end_at,
      user_id
    } = req.body;

    // Validation
    if (!resource_id || !start_at || !end_at) {
      return res.status(400).json({
        success: false,
        message: 'Ressource, date de début et date de fin sont requis'
      });
    }

    // Vérifier les conflits de réservation
    const conflicts = await reservationModel.checkConflicts(
      resource_id,
      start_at,
      end_at
    );

    if (conflicts.length > 0) {
      // Fournir des alternatives
      const alternatives = await reservationModel.findAlternatives(
        resource_id,
        start_at,
        end_at
      );

      return res.status(409).json({
        success: false,
        message: 'Conflit de réservation détecté',
        conflicts,
        alternatives,
        suggested_slots: [
          { start_at: new Date(start_at).toISOString(), end_at: new Date(end_at).toISOString() }
        ]
      });
    }

    const reservationData = {
      event_id: event_id || null,
      resource_id,
      user_id: user_id || req.user.id,
      start_at,
      end_at,
      status: 'PENDING'
    };

    const reservationId = await reservationModel.createReservation(reservationData);

    // Notifier le manager
    const managers = await require('../models/userModel').getUsersByRole('MANAGER');
    for (const manager of managers) {
      await notificationUtils.createNotification({
        user_id: manager.id,
        title: 'Nouvelle réservation en attente',
        message: `Une nouvelle réservation nécessite votre validation.`
      });
    }

    // Notifier l'utilisateur
    await notificationUtils.createNotification({
      user_id: reservationData.user_id,
      title: 'Réservation créée',
      message: `Votre réservation a été créée et est en attente de validation.`
    });

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CREATE_RESERVATION',
      object_type: 'RESERVATION',
      object_id: reservationId,
      detail: reservationData
    });

    const reservation = await reservationModel.getReservationById(reservationId);

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Mettre à jour une réservation
 */
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si la réservation existe
    const existingReservation = await reservationModel.getReservationById(id);
    if (!existingReservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && 
        existingReservation.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette réservation'
      });
    }

    // Si changement de dates, vérifier les conflits
    if ((updateData.start_at || updateData.end_at) && updateData.resource_id) {
      const conflicts = await reservationModel.checkConflicts(
        updateData.resource_id || existingReservation.resource_id,
        updateData.start_at || existingReservation.start_at,
        updateData.end_at || existingReservation.end_at,
        id // Exclure la réservation courante
      );

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Conflit de réservation détecté',
          conflicts
        });
      }
    }

    await reservationModel.updateReservation(id, updateData);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'UPDATE_RESERVATION',
      object_type: 'RESERVATION',
      object_id: id,
      detail: updateData
    });

    const updatedReservation = await reservationModel.getReservationById(id);

    res.json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Changer le statut d'une réservation
 */
exports.changeReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation du statut
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Vérifier si la réservation existe
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    await reservationModel.updateReservationStatus(id, status);

    // Notifier l'utilisateur
    const statusMessages = {
      'CONFIRMED': 'confirmée',
      'REJECTED': 'rejetée',
      'CANCELLED': 'annulée'
    };

    if (statusMessages[status]) {
      await notificationUtils.createNotification({
        user_id: reservation.user_id,
        title: `Réservation ${statusMessages[status]}`,
        message: `Votre réservation pour ${reservation.resource_name} a été ${statusMessages[status]}.`
      });
    }

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CHANGE_RESERVATION_STATUS',
      object_type: 'RESERVATION',
      object_id: id,
      detail: { from: reservation.status, to: status }
    });

    const updatedReservation = await reservationModel.getReservationById(id);

    res.json({
      success: true,
      message: `Statut de la réservation mis à jour: ${status}`,
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Annuler une réservation
 */
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la réservation existe
    const reservation = await reservationModel.getReservationById(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && 
        reservation.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette réservation'
      });
    }

    await reservationModel.updateReservationStatus(id, 'CANCELLED');

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CANCEL_RESERVATION',
      object_type: 'RESERVATION',
      object_id: id,
      detail: { previous_status: reservation.status }
    });

    res.json({
      success: true,
      message: 'Réservation annulée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};