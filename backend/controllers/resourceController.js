/**
 * Contrôleur de gestion des ressources
 */

const resourceModel = require('../models/resourceModel');
const auditModel = require('../models/auditModel');

/**
 * Récupérer toutes les ressources
 */
exports.getAllResources = async (req, res) => {
  try {
    const { available_from, available_to, status, type } = req.query;
    
    const resources = await resourceModel.getAllResources({
      available_from,
      available_to,
      status,
      type
    });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ressources:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Récupérer une ressource par ID
 */
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceModel.getResourceById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée'
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la ressource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Créer une nouvelle ressource
 */
exports.createResource = async (req, res) => {
  try {
    const {
      name,
      type,
      capacity,
      location,
      status,
      attributes
    } = req.body;

    // Validation
    if (!name || !type || !location) {
      return res.status(400).json({
        success: false,
        message: 'Nom, type et location sont requis'
      });
    }

    const resourceData = {
      name,
      type,
      capacity: capacity || 1,
      location,
      status: status || 'AVAILABLE',
      attributes: attributes ? JSON.parse(attributes) : null
    };

    const resourceId = await resourceModel.createResource(resourceData);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'CREATE_RESOURCE',
      object_type: 'RESOURCE',
      object_id: resourceId,
      detail: resourceData
    });

    const resource = await resourceModel.getResourceById(resourceId);

    res.status(201).json({
      success: true,
      message: 'Ressource créée avec succès',
      resource
    });
  } catch (error) {
    console.error('Erreur lors de la création de la ressource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Mettre à jour une ressource
 */
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si la ressource existe
    const existingResource = await resourceModel.getResourceById(id);
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée'
      });
    }

    await resourceModel.updateResource(id, updateData);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'UPDATE_RESOURCE',
      object_type: 'RESOURCE',
      object_id: id,
      detail: updateData
    });

    const updatedResource = await resourceModel.getResourceById(id);

    res.json({
      success: true,
      message: 'Ressource mise à jour avec succès',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la ressource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Supprimer une ressource
 */
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la ressource existe
    const resource = await resourceModel.getResourceById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée'
      });
    }

    await resourceModel.deleteResource(id);

    // Log d'audit
    await auditModel.logAction({
      user_id: req.user.id,
      action: 'DELETE_RESOURCE',
      object_type: 'RESOURCE',
      object_id: id,
      detail: { name: resource.name }
    });

    res.json({
      success: true,
      message: 'Ressource supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la ressource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

/**
 * Vérifier la disponibilité d'une ressource
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_at, end_at } = req.query;

    if (!start_at || !end_at) {
      return res.status(400).json({
        success: false,
        message: 'start_at et end_at sont requis'
      });
    }

    const isAvailable = await resourceModel.checkAvailability(id, start_at, end_at);

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Ressource disponible' : 'Ressource non disponible pour ce créneau'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};