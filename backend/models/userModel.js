/**
 * Modèle pour la gestion des utilisateurs
 */

const db = require('../config/db');

/**
 * Récupérer tous les utilisateurs
 */
exports.getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, email, password, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

/**
 * Récupérer un utilisateur par ID
 */
exports.getUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, email, password, full_name, role, is_active, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

/**
 * Récupérer un utilisateur par email
 */
exports.getUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT id, email, password, full_name, role, is_active, created_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

/**
 * Créer un nouvel utilisateur
 */
exports.createUser = async (userData) => {
  const { email, password, full_name, role = 'CLIENT', is_active = 1 } = userData;
  
  const [result] = await db.query(
    'INSERT INTO users (email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)',
    [email, password, full_name, role, is_active]
  );
  
  return result.insertId;
};

/**
 * Mettre à jour un utilisateur
 */
exports.updateUser = async (id, updateData) => {
  const fields = [];
  const values = [];
  
  Object.keys(updateData).forEach(key => {
    fields.push(`${key} = ?`);
    values.push(updateData[key]);
  });
  
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Récupérer les utilisateurs par rôle
 */
exports.getUsersByRole = async (role) => {
  const [rows] = await db.query(
    'SELECT id, email, full_name, role, is_active FROM users WHERE role = ? AND is_active = 1',
    [role]
  );
  return rows;
};

/**
 * Supprimer un utilisateur (soft delete)
 */
exports.deleteUser = async (id) => {
  const [result] = await db.query(
    'UPDATE users SET is_active = 0 WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};