/**
 * Modèle pour la gestion des ressources
 */

const db = require('../config/db');

/**
 * Récupérer toutes les ressources
 */
exports.getAllResources = async (filters = {}) => {
  let query = `
    SELECT r.*, 
           COUNT(DISTINCT res.id) as total_reservations
    FROM resources r
    LEFT JOIN reservations res ON r.id = res.resource_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.status) {
    query += ' AND r.status = ?';
    params.push(filters.status);
  }
  
  if (filters.type) {
    query += ' AND r.type = ?';
    params.push(filters.type);
  }
  
  if (filters.available_from && filters.available_to) {
    query += ` AND r.id NOT IN (
      SELECT resource_id 
      FROM reservations 
      WHERE status IN ('CONFIRMED', 'PENDING')
      AND (
        (start_at < ? AND end_at > ?) OR
        (start_at BETWEEN ? AND ?) OR
        (end_at BETWEEN ? AND ?)
      )
    )`;
    params.push(filters.available_to, filters.available_from);
    params.push(filters.available_from, filters.available_to);
    params.push(filters.available_from, filters.available_to);
  }
  
  query += ' GROUP BY r.id ORDER BY r.created_at DESC';
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Récupérer une ressource par ID
 */
exports.getResourceById = async (id) => {
  const [rows] = await db.query(
    `SELECT r.*, 
            COUNT(DISTINCT res.id) as total_reservations
     FROM resources r
     LEFT JOIN reservations res ON r.id = res.resource_id
     WHERE r.id = ?
     GROUP BY r.id`,
    [id]
  );
  return rows[0];
};

/**
 * Créer une nouvelle ressource
 */
exports.createResource = async (resourceData) => {
  const { name, type, capacity, location, status, attributes } = resourceData;
  
  const [result] = await db.query(
    `INSERT INTO resources (name, type, capacity, location, status, attributes) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, type, capacity, location, status, JSON.stringify(attributes)]
  );
  
  return result.insertId;
};

/**
 * Mettre à jour une ressource
 */
exports.updateResource = async (id, updateData) => {
  const fields = [];
  const values = [];
  
  Object.keys(updateData).forEach(key => {
    if (key === 'attributes' && updateData[key]) {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(updateData[key]));
    } else {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  });
  
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE resources SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprimer une ressource
 */
exports.deleteResource = async (id) => {
  const [result] = await db.query('DELETE FROM resources WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

/**
 * Vérifier la disponibilité d'une ressource
 */
exports.checkAvailability = async (resourceId, startAt, endAt) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) as count
     FROM reservations 
     WHERE resource_id = ? 
     AND status IN ('CONFIRMED', 'PENDING')
     AND (
       (start_at < ? AND end_at > ?) OR
       (start_at BETWEEN ? AND ?) OR
       (end_at BETWEEN ? AND ?)
     )`,
    [resourceId, endAt, startAt, startAt, endAt, startAt, endAt]
  );
  
  return rows[0].count === 0;
};