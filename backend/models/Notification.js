const pool = require('../config/db');

class Notification {
    static async create(notification) {
        const { user_id, title, message, type, related_type, related_id } = notification;
        const [result] = await pool.query(
            'INSERT INTO notifications (user_id, title, message, type, related_type, related_id) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, title, message, type, related_type, related_id]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await pool.query(`
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC
            LIMIT 50
        `, [userId]);
        return rows;
    }

    static async markAsRead(id) {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    }

    static async markAllAsRead(userId) {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    }

    static async getUnreadCount(userId) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return rows[0].count;
    }

    static async delete(id) {
        await pool.query('DELETE FROM notifications WHERE id = ?', [id]);
    }
}

module.exports = Notification;