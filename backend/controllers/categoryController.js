const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = await Category.create(name);
        res.json({
            success: true,
            message: 'Catégorie créée avec succès',
            categoryId
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await Category.update(id, name);
        res.json({
            success: true,
            message: 'Catégorie mise à jour avec succès'
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.delete(id);
        res.json({
            success: true,
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};