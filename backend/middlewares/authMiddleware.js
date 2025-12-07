/**
 * Middleware d'authentification simple
 * Utilise x-user-id header pour identifier l'utilisateur
 */

const userModel = require('../models/userModel');

/**
 * Middleware pour vérifier l'authentification
 * Lecture de l'ID utilisateur depuis les headers
 */
exports.requireAuth = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé'
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

/**
 * Middleware pour vérifier le rôle ADMIN
 */
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs'
    });
  }
  next();
};

/**
 * Middleware pour vérifier le rôle MANAGER
 */
exports.requireManager = (req, res, next) => {
  if (req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux managers'
    });
  }
  next();
};

/**
 * Middleware pour vérifier le rôle MANAGER ou ADMIN
 */
exports.requireManagerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'MANAGER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux managers et administrateurs'
    });
  }
  next();
};

/**
 * Middleware pour vérifier le rôle CLIENT
 */
exports.requireClient = (req, res, next) => {
  if (req.user.role !== 'CLIENT') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux clients'
    });
  }
  next();
};