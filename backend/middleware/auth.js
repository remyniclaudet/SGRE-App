// Middleware d'authentification simple (sans JWT pour la simplicité)

exports.authenticate = (req, res, next) => {
    // Pour la simplicité, on accepte l'ID utilisateur dans le header
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
    }
    
    req.userId = parseInt(userId);
    next();
};

exports.authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const User = require('../models/User');
            const user = await User.findById(req.userId);
            
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Non autorisé' });
            }
            
            req.userRole = user.role;
            next();
            
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };
};