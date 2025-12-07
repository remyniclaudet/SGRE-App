/**
 * Contrôleur de génération de rapports
 */

const reportModel = require('../models/reportModel');

/**
 * Statistiques d'utilisation des ressources
 */
exports.getResourceUsage = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const usageStats = await reportModel.getResourceUsage(start_date, end_date);

    res.json({
      success: true,
      stats: usageStats
    });
  } catch (error) {
    console.error('Erreur lors de la génération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Statistiques des événements
 */
exports.getEventStatistics = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const eventStats = await reportModel.getEventStatistics(start_date, end_date);

    res.json({
      success: true,
      stats: eventStats
    });
  } catch (error) {
    console.error('Erreur lors de la génération des statistiques événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Activité des utilisateurs
 */
exports.getUserActivity = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const userActivity = await reportModel.getUserActivity(start_date, end_date);

    res.json({
      success: true,
      activity: userActivity
    });
  } catch (error) {
    console.error('Erreur lors de la génération des statistiques utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Logs d'audit
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { user_id, action, start_date, end_date, limit = 100 } = req.query;
    
    const logs = await reportModel.getAuditLogs({
      user_id,
      action,
      start_date,
      end_date,
      limit
    });

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Réservations pour manager
 */
exports.getManagerReservations = async (req, res) => {
  try {
    const { status, start_date, end_date } = req.query;
    
    const reservations = await reportModel.getManagerReservations({
      status,
      start_date,
      end_date
    });

    res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations manager:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Événements pour manager
 */
exports.getManagerEvents = async (req, res) => {
  try {
    const { status, start_date, end_date } = req.query;
    
    const events = await reportModel.getManagerEvents({
      status,
      start_date,
      end_date
    });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements manager:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};