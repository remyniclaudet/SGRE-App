const pool = require('../config/db');

class Category {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
        return rows;
    }

    static async create(name) {
        const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
        return result.insertId;
    }

    static async delete(id) {
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    }

    static async update(id, name) {
        await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    }
}

module.exports = Category;