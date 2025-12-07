const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const userId = await User.create({
            name,
            email,
            password,
            role: role || 'manager'
        });
        
        res.json({
            success: true,
            message: 'Utilisateur créé avec succès',
            userId
        });
        
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        
        await User.update(id, { name, email, role });
        
        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ne pas permettre la suppression de soi-même
        if (parseInt(id) === req.userId) {
            return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }
        
        await User.delete(id);
        
        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
        
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const stats = await User.getStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};