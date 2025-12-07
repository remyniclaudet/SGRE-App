/**
 * Contrôleur de gestion des utilisateurs
 * Accessible uniquement par les administrateurs
 */

const userModel = require('../models/userModel');
const auditModel = require('../models/auditModel');

/**
 * Récupérer tous les utilisateurs
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    
    // Ne pas renvoyer les mots de passe
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
    }));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer un utilisateur par ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ne pas renvoyer le mot de passe
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
    };

    res.json({
      success: true,
      user: sanitizedUser
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Mettre à jour un utilisateur
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour l'utilisateur
    await userModel.updateUser(id, updateData);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'UPDATE_USER',
      object_type: 'USER',
      object_id: id,
      detail: updateData
    });

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await userModel.getUserById(id);

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        role: updatedUser.role,
        isActive: updatedUser.is_active
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

/**
 * Changer le rôle d'un utilisateur
 */
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation du rôle
    const validRoles = ['ADMIN', 'MANAGER', 'CLIENT'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Rôles valides: ADMIN, MANAGER, CLIENT'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour le rôle
    await userModel.updateUser(id, { role });

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CHANGE_ROLE',
      object_type: 'USER',
      object_id: id,
      detail: { from: user.role, to: role }
    });

    res.json({
      success: true,
      message: `Rôle mis à jour avec succès: ${role}`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: role,
        isActive: user.is_active
      }
    });
  } catch (error) {
    console.error('Erreur lors du changement de rôle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Activer/Désactiver un utilisateur
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour le statut
    const newStatus = isActive ? 1 : 0;
    await userModel.updateUser(id, { is_active: newStatus });

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      object_type: 'USER',
      object_id: id,
      detail: { previousStatus: user.is_active, newStatus }
    });

    res.json({
      success: true,
      message: newStatus ? 'Utilisateur activé' : 'Utilisateur désactivé',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: newStatus
      }
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};