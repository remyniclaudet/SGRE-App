/**
 * Contrôleur d'authentification
 * Gère l'inscription, la connexion et la gestion de session
 */

const userModel = require('../models/userModel');
const auditModel = require('../models/auditModel');

/**
 * Inscription d'un nouvel utilisateur
 */
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validation basique
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, mot de passe et nom complet sont requis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur (mot de passe en clair)
    const userData = {
      email,
      password, // Stocké en clair (conformément à la demande)
      full_name: fullName,
      role: 'CLIENT', // Rôle par défaut
      is_active: 1
    };

    const userId = await userModel.createUser(userData);

    // Récupérer l'utilisateur créé
    const user = await userModel.getUserById(userId);

    // Log d'audit
    await auditModel.logAction({
      user_id: userId,
      action: 'REGISTER',
      object_type: 'USER',
      object_id: userId,
      detail: { email, role: 'CLIENT' }
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

/**
 * Connexion utilisateur
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont requis'
      });
    }

    // Récupérer l'utilisateur
    const user = await userModel.getUserByEmail(email);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte est désactivé'
      });
    }

    // Vérifier le mot de passe (en clair)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Log d'audit
    await auditModel.logAction({
      user_id: user.id,
      action: 'LOGIN',
      object_type: 'USER',
      object_id: user.id,
      detail: { email }
    });

    // Retourner les informations utilisateur
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

/**
 * Récupérer les informations de l'utilisateur courant
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};