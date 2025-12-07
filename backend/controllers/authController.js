const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Rechercher l'utilisateur par email
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        // Vérifier le mot de passe (sans hash pour la simplicité)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        // Retourner les informations de l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role = 'client' } = req.body;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        // Créer l'utilisateur
        const userId = await User.create({
            name,
            email,
            password, // Stocker en clair pour la simplicité
            role
        });
        
        res.json({
            success: true,
            message: 'Compte créé avec succès',
            userId
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        await User.update(req.userId, { name, email });
        
        res.json({
            success: true,
            message: 'Profil mis à jour avec succès'
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};