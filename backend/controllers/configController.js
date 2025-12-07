const pool = require('../config/db');

exports.getConfig = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM site_config');
        const config = {};
        rows.forEach(row => {
            config[row.setting_key] = row.setting_value;
        });
        res.json({
            success: true,
            config
        });
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const updates = req.body;
        
        for (const [key, value] of Object.entries(updates)) {
            await pool.query(
                'INSERT INTO site_config (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }
        
        res.json({
            success: true,
            message: 'Configuration mise à jour avec succès'
        });
    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};