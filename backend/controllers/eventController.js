const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getPublicEvents = async (req, res) => {
    try {
        const events = await Event.getPublicEvents();
        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Get public events error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.findByManager(req.userId);
        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        
        // Si l'utilisateur n'est pas admin/manager, vérifier si l'événement est public
        if (req.userRole !== 'admin' && req.userRole !== 'manager' && !event.is_public) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        
        // Récupérer les ressources associées
        const resources = await Event.getEventResources(id);
        
        res.json({
            success: true,
            event: {
                ...event,
                resources
            }
        });
        
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, status, is_public } = req.body;
        
        const eventId = await Event.create({
            title,
            description,
            date,
            location,
            manager_id: req.userId,
            status: status || 'planned',
            is_public: is_public !== false
        });
        
        res.json({
            success: true,
            message: 'Événement créé avec succès',
            eventId
        });
        
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        await Event.update(id, updates);
        
        res.json({
            success: true,
            message: 'Événement mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Event.delete(id);
        
        res.json({
            success: true,
            message: 'Événement supprimé avec succès'
        });
        
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.addResourceToEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { resource_id } = req.body;
        
        await Event.addResource(id, resource_id);
        
        res.json({
            success: true,
            message: 'Ressource ajoutée à l\'événement avec succès'
        });
        
    } catch (error) {
        console.error('Add resource to event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};