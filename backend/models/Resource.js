const pool = require('../config/db');

class Resource {
    static async create(resource) {
        const { name, type, category_id, status, description, capacity, location, created_by } = resource;
        const [result] = await pool.query(
            'INSERT INTO resources (name, type, category_id, status, description, capacity, location, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, type, category_id, status, description, capacity, location, created_by]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query(`
            SELECT r.*, c.name as category_name, u.name as creator_name 
            FROM resources r
            LEFT JOIN categories c ON r.category_id = c.id
            LEFT JOIN users u ON r.created_by = u.id
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`
            SELECT r.*, c.name as category_name, u.name as creator_name 
            FROM resources r
            LEFT JOIN categories c ON r.category_id = c.id
            LEFT JOIN users u ON r.created_by = u.id
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
        await pool.query(`UPDATE resources SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    static async delete(id) {
        await pool.query('DELETE FROM resources WHERE id = ?', [id]);
    }

    static async getByType(type) {
        const [rows] = await pool.query('SELECT * FROM resources WHERE type = ? AND status = "available"', [type]);
        return rows;
    }

    static async getByCategory(categoryId) {
        const [rows] = await pool.query('SELECT * FROM resources WHERE category_id = ? AND status = "available"', [categoryId]);
        return rows;
    }

    static async getAvailable(startDate, endDate) {
        const [rows] = await pool.query(`
            SELECT r.* 
            FROM resources r
            WHERE r.status = 'available'
            AND r.id NOT IN (
                SELECT resource_id 
                FROM reservations 
                WHERE status IN ('confirmed', 'pending')
                AND (
                    (start_date <= ? AND end_date >= ?) OR
                    (start_date >= ? AND start_date <= ?)
                )
            )
        `, [endDate, startDate, startDate, endDate]);
        return rows;
    }

    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
                SUM(CASE WHEN status = 'unavailable' THEN 1 ELSE 0 END) as unavailable,
                SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
            FROM resources
        `);
        return rows[0];
    }
}

module.exports = Resource;