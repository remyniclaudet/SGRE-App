/**
 * Utilitaires pour la gestion des notifications
 */

const notificationModel = require('../models/notificationModel');

/**
 * Créer une notification pour un utilisateur
 */
exports.createNotification = async ({ user_id, title, message }) => {
  try {
    await notificationModel.createNotification({
      user_id,
      title,
      message
    });
    console.log(`Notification créée pour l'utilisateur ${user_id}: ${title}`);
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
};

/**
 * Créer une notification pour plusieurs utilisateurs
 */
exports.createNotifications = async (users, title, message) => {
  try {
    for (const user of users) {
      await this.createNotification({
        user_id: user.id,
        title,
        message
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création des notifications:', error);
  }
};

/**
 * Créer une notification de conflit de réservation
 */
exports.createReservationConflictNotification = async (reservation, conflicts) => {
  try {
    await this.createNotification({
      user_id: reservation.user_id,
      title: 'Conflit de réservation',
      message: `Votre réservation entre ${new Date(reservation.start_at).toLocaleString()} et ${new Date(reservation.end_at).toLocaleString()} entre en conflit avec d'autres réservations. Veuillez choisir un autre créneau.`
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification de conflit:', error);
  }
};

/**
 * Créer une notification de confirmation de réservation
 */
exports.createReservationConfirmationNotification = async (reservation) => {
  try {
    await this.createNotification({
      user_id: reservation.user_id,
      title: 'Réservation confirmée',
      message: `Votre réservation pour ${reservation.resource_name} entre ${new Date(reservation.start_at).toLocaleString()} et ${new Date(reservation.end_at).toLocaleString()} a été confirmée.`
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification de confirmation:', error);
  }
};

/**
 * Créer une notification de modification d'événement
 */
exports.createEventUpdateNotification = async (event, participants) => {
  try {
    for (const participant of participants) {
      await this.createNotification({
        user_id: participant.user_id,
        title: 'Événement modifié',
        message: `L'événement "${event.title}" a été modifié. Veuillez vérifier les nouvelles informations.`
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création des notifications de modification:', error);
  }
};