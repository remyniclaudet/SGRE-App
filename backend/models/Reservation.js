const pool = require('../config/db');

class Reservation {
    static async create(reservation) {
        const { user_id, resource_id, event_id, start_date, end_date, status, notes } = reservation;
        const [result] = await pool.query(
            'INSERT INTO reservations (user_id, resource_id, event_id, start_date, end_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, resource_id, event_id, start_date, end_date, status, notes]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query(`
            SELECT r.*, 
                   u.name as user_name, 
                   res.name as resource_name,
                   e.title as event_title
            FROM reservations r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN resources res ON r.resource_id = res.id
            LEFT JOIN events e ON r.event_id = e.id
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT r.*, 
                   u.name as user_name, 
                   res.name as resource_name,
                   e.title as event_title
            FROM reservations r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN resources res ON r.resource_id = res.id
            LEFT JOIN events e ON r.event_id = e.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    }

    static async update(id, updates) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        
        values.push(id);
        await pool.query(`UPDATE reservations SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    static async delete(id) {
        await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
    }

    static async findByUser(userId) {
        const [rows] = await pool.query(`
            SELECT r.*, 
                   u.name as user_name, 
                   res.name as resource_name,
                   e.title as event_title
            FROM reservations r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN resources res ON r.resource_id = res.id
            LEFT JOIN events e ON r.event_id = e.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);
        return rows;
    }

    static async findByResource(resourceId) {
        const [rows] = await pool.query(`
            SELECT r.*, u.name as user_name 
            FROM reservations r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.resource_id = ?
            ORDER BY r.start_date
        `, [resourceId]);
        return rows;
    }

    static async getPending() {
        const [rows] = await pool.query(`
            SELECT r.*, u.name as user_name, res.name as resource_name
            FROM reservations r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN resources res ON r.resource_id = res.id
            WHERE r.status = 'pending'
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM reservations
        `);
        return rows[0];
    }
}

module.exports = Reservation;