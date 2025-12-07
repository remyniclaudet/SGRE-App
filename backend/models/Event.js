const pool = require('../config/db');

class Event {
    static async create(event) {
        const { title, description, date, location, manager_id, status, is_public } = event;
        const [result] = await pool.query(
            'INSERT INTO events (title, description, date, location, manager_id, status, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, date, location, manager_id, status, is_public]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query(`
            SELECT e.*, u.name as manager_name 
            FROM events e
            LEFT JOIN users u ON e.manager_id = u.id
            ORDER BY e.date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT e.*, u.name as manager_name 
            FROM events e
            LEFT JOIN users u ON e.manager_id = u.id
            WHERE e.id = ?
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
        await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    static async delete(id) {
        await pool.query('DELETE FROM events WHERE id = ?', [id]);
    }

    static async findByManager(managerId) {
        const [rows] = await pool.query(`
            SELECT e.*, u.name as manager_name 
            FROM events e
            LEFT JOIN users u ON e.manager_id = u.id
            WHERE e.manager_id = ?
            ORDER BY e.date DESC
        `, [managerId]);
        return rows;
    }

    static async getPublicEvents() {
        const [rows] = await pool.query(`
            SELECT e.*, u.name as manager_name 
            FROM events e
            LEFT JOIN users u ON e.manager_id = u.id
            WHERE e.is_public = TRUE
            ORDER BY e.date DESC
        `);
        return rows;
    }

    static async addResource(eventId, resourceId) {
        await pool.query(
            'INSERT INTO event_resources (event_id, resource_id) VALUES (?, ?)',
            [eventId, resourceId]
        );
    }

    static async getEventResources(eventId) {
        const [rows] = await pool.query(`
            SELECT r.* 
            FROM resources r
            INNER JOIN event_resources er ON r.id = er.resource_id
            WHERE er.event_id = ?
        `, [eventId]);
        return rows;
    }

    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as planned,
                SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM events
        `);
        return rows[0];
    }
}

module.exports = Event;