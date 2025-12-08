const Resource = require('../models/Resource');

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json({
            success: true,
            resources
        });
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getPublicResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        // Filtrer pour ne montrer que les ressources disponibles
        const publicResources = resources.filter(r => r.status === 'available');
        res.json({
            success: true,
            resources: publicResources
        });
    } catch (error) {
        console.error('Get public resources error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }
        
        res.json({
            success: true,
            resource
        });
        
    } catch (error) {
        console.error('Get resource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getPublicResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);
        
        if (!resource || resource.status !== 'available') {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }
        
        res.json({
            success: true,
            resource
        });
        
    } catch (error) {
        console.error('Get public resource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createResource = async (req, res) => {
    try {
        const { name, type, category_id, status, description, capacity, location } = req.body;
        
        const resourceId = await Resource.create({
            name,
            type,
            category_id,
            status: status || 'available',
            description,
            capacity,
            location,
            created_by: req.userId
        });
        
        res.json({
            success: true,
            message: 'Ressource créée avec succès',
            resourceId
        });
        
    } catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        await Resource.update(id, updates);
        
        res.json({
            success: true,
            message: 'Ressource mise à jour avec succès'
        });
        
    } catch (error) {
        console.error('Update resource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Resource.delete(id);
        
        res.json({
            success: true,
            message: 'Ressource supprimée avec succès'
        });
        
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getAvailableResources = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        if (!start_date || !end_date) {
            const resources = await Resource.findAll();
            return res.json({
                success: true,
                resources: resources.filter(r => r.status === 'available')
            });
        }
        
        const resources = await Resource.getAvailable(start_date, end_date);
        res.json({
            success: true,
            resources
        });
        
    } catch (error) {
        console.error('Get available resources error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getResourceStats = async (req, res) => {
    try {
        const stats = await Resource.getStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get resource stats error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.checkAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.query;
        
        if (!start_date || !end_date) {
            return res.status(400).json({ 
                success: false,
                message: 'Les dates de début et de fin sont requises' 
            });
        }
        
        const resource = await Resource.findById(id);
        if (!resource || resource.status !== 'available') {
            return res.json({
                success: false,
                available: false,
                message: 'Ressource non disponible'
            });
        }
        
        // Vérifier les réservations existantes
        const reservations = await Reservation.findByResource(id);
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        const hasConflict = reservations.some(reservation => {
            if (reservation.status !== 'confirmed') return false;
            
            const resStart = new Date(reservation.start_date);
            const resEnd = new Date(reservation.end_date);
            
            return (startDate < resEnd && endDate > resStart);
        });
        
        res.json({
            success: true,
            available: !hasConflict,
            message: hasConflict ? 'Ressource déjà réservée pour cette période' : 'Disponible'
        });
        
    } catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur lors de la vérification de disponibilité' 
        });
    }
};