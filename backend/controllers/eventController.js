/**
 * Contrôleur de gestion des événements
 */

const eventModel = require('../models/eventModel');
const auditModel = require('../models/auditModel');
const notificationUtils = require('../utils/notifications');

/**
 * Récupérer tous les événements
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { status, start_date, end_date, organizer_id } = req.query;
    
    const events = await eventModel.getAllEvents({
      status,
      start_date,
      end_date,
      organizer_id
    });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer un événement par ID
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventModel.getEventById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Créer un nouvel événement
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start_at,
      end_at,
      location,
      status,
      organizer_id
    } = req.body;

    // Validation
    if (!title || !start_at || !end_at || !location) {
      return res.status(400).json({
        success: false,
        message: 'Titre, dates et location sont requis'
      });
    }

    const eventData = {
      title,
      description: description || '',
      organizer_id: organizer_id || req.user.id,
      start_at,
      end_at,
      location,
      status: status || 'DRAFT'
    };

    const eventId = await eventModel.createEvent(eventData);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CREATE_EVENT',
      object_type: 'EVENT',
      object_id: eventId,
      detail: eventData
    });

    const event = await eventModel.getEventById(eventId);

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      event
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Mettre à jour un événement
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si l'événement existe
    const existingEvent = await eventModel.getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    await eventModel.updateEvent(id, updateData);

    // Notifier les participants si l'événement est modifié
    if (updateData.start_at || updateData.location) {
      const participants = await eventModel.getEventParticipants(id);
      for (const participant of participants) {
        await notificationUtils.createNotification({
          user_id: participant.user_id,
          title: 'Événement modifié',
          message: `L'événement "${existingEvent.title}" a été modifié. Vérifiez les nouvelles informations.`
        });
      }
    }

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'UPDATE_EVENT',
      object_type: 'EVENT',
      object_id: id,
      detail: updateData
    });

    const updatedEvent = await eventModel.getEventById(id);

    res.json({
      success: true,
      message: 'Événement mis à jour avec succès',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Supprimer un événement
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'événement existe
    const event = await eventModel.getEventById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    await eventModel.deleteEvent(id);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'DELETE_EVENT',
      object_type: 'EVENT',
      object_id: id,
      detail: { title: event.title }
    });

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Ajouter un participant à un événement
 */
exports.addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // Vérifier si l'événement existe
    const event = await eventModel.getEventById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'utilisateur est déjà participant
    const existingParticipant = await eventModel.getParticipant(id, user_id);
    if (existingParticipant) {
      return res.status(409).json({
        success: false,
        message: 'Utilisateur déjà inscrit à cet événement'
      });
    }

    await eventModel.addParticipant({
      event_id: id,
      user_id: user_id || req.user.id,
      status: 'CONFIRMED'
    });

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'ADD_PARTICIPANT',
      object_type: 'EVENT',
      object_id: id,
      detail: { participant_id: user_id || req.user.id }
    });

    res.status(201).json({
      success: true,
      message: 'Participant ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du participant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Retirer un participant d'un événement
 */
exports.removeParticipant = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Vérifier si l'événement existe
    const event = await eventModel.getEventById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    await eventModel.removeParticipant(id, userId);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'REMOVE_PARTICIPANT',
      object_type: 'EVENT',
      object_id: id,
      detail: { participant_id: userId }
    });

    res.json({
      success: true,
      message: 'Participant retiré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du retrait du participant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer les participants d'un événement
 */
exports.getEventParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await eventModel.getEventParticipants(id);

    res.json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};