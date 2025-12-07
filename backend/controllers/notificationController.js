/**
 * Contrôleur de gestion des notifications
 */

const notificationModel = require('../models/notificationModel');

/**
 * Récupérer les notifications de l'utilisateur
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const { read } = req.query;
    const userId = req.user.id;

    const notifications = await notificationModel.getUserNotifications(userId, read === 'true');

    res.json({
      success: true,
      count: notifications.length,
      unread_count: notifications.filter(n => !n.read_at).length,
      notifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Marquer une notification comme lue
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si la notification appartient à l'utilisateur
    const notification = await notificationModel.getNotificationById(id);
    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    await notificationModel.markAsRead(id);

    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationModel.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Supprimer une notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si la notification appartient à l'utilisateur
    const notification = await notificationModel.getNotificationById(id);
    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    await notificationModel.deleteNotification(id);

    res.json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};