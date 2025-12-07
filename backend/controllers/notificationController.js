const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findByUser(req.userId);
        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.markAsRead(id);
        res.json({
            success: true,
            message: 'Notification marquée comme lue'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.userId);
        res.json({
            success: true,
            message: 'Toutes les notifications marquées comme lues'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.userId);
        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.delete(id);
        res.json({
            success: true,
            message: 'Notification supprimée'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};