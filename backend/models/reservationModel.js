/**
 * Modèle pour la gestion des réservations
 */

const db = require('../config/db');

/**
 * Récupérer toutes les réservations
 */
exports.getAllReservations = async (filters = {}) => {
  let query = `
    SELECT r.*,
           res.name as resource_name,
           res.type as resource_type,
           res.location as resource_location,
           u.full_name as user_name,
           u.email as user_email,
           e.title as event_title
    FROM reservations r
    LEFT JOIN resources res ON r.resource_id = res.id
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN events e ON r.event_id = e.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.status) {
    query += ' AND r.status = ?';
    params.push(filters.status);
  }
  
  if (filters.resource_id) {
    query += ' AND r.resource_id = ?';
    params.push(filters.resource_id);
  }
  
  if (filters.user_id) {
    query += ' AND r.user_id = ?';
    params.push(filters.user_id);
  }
  
  if (filters.start_date) {
    query += ' AND r.start_at >= ?';
    params.push(filters.start_date);
  }
  
  if (filters.end_date) {
    query += ' AND r.end_at <= ?';
    params.push(filters.end_date);
  }
  
  query += ' ORDER BY r.created_at DESC';
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Récupérer les réservations d'un utilisateur
 */
exports.getUserReservations = async (userId) => {
  const [rows] = await db.query(
    `SELECT r.*,
            res.name as resource_name,
            res.type as resource_type,
            res.location as resource_location,
            e.title as event_title
     FROM reservations r
     LEFT JOIN resources res ON r.resource_id = res.id
     LEFT JOIN events e ON r.event_id = e.id
     WHERE r.user_id = ?
     ORDER BY r.start_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Récupérer une réservation par ID
 */
exports.getReservationById = async (id) => {
  const [rows] = await db.query(
    `SELECT r.*,
            res.name as resource_name,
            res.type as resource_type,
            res.location as resource_location,
            u.full_name as user_name,
            u.email as user_email,
            e.title as event_title,
            e.description as event_description
     FROM reservations r
     LEFT JOIN resources res ON r.resource_id = res.id
     LEFT JOIN users u ON r.user_id = u.id
     LEFT JOIN events e ON r.event_id = e.id
     WHERE r.id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Créer une nouvelle réservation
 */
exports.createReservation = async (reservationData) => {
  const { event_id, resource_id, user_id, start_at, end_at, status } = reservationData;
  
  const [result] = await db.query(
    `INSERT INTO reservations (event_id, resource_id, user_id, start_at, end_at, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [event_id || null, resource_id, user_id, start_at, end_at, status]
  );
  
  return result.insertId;
};

/**
 * Mettre à jour une réservation
 */
exports.updateReservation = async (id, updateData) => {
  const fields = [];
  const values = [];
  
  Object.keys(updateData).forEach(key => {
    fields.push(`${key} = ?`);
    values.push(updateData[key]);
  });
  
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE reservations SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Mettre à jour le statut d'une réservation
 */
exports.updateReservationStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE reservations SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

/**
 * Vérifier les conflits de réservation
 */
exports.checkConflicts = async (resourceId, startAt, endAt, excludeReservationId = null) => {
  let query = `
    SELECT r.*,
           res.name as resource_name,
           u.full_name as user_name
    FROM reservations r
    LEFT JOIN resources res ON r.resource_id = res.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.resource_id = ?
    AND r.status IN ('CONFIRMED', 'PENDING')
    AND (
      (r.start_at < ? AND r.end_at > ?) OR
      (r.start_at BETWEEN ? AND ?) OR
      (r.end_at BETWEEN ? AND ?)
    )
  `;
  
  const params = [resourceId, endAt, startAt, startAt, endAt, startAt, endAt];
  
  if (excludeReservationId) {
    query += ' AND r.id != ?';
    params.push(excludeReservationId);
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Trouver des alternatives de réservation
 */
exports.findAlternatives = async (resourceId, startAt, endAt) => {
  // Trouver d'autres ressources du même type
  const [rows] = await db.query(
    `SELECT res.*,
            (SELECT COUNT(*) 
             FROM reservations r 
             WHERE r.resource_id = res.id
             AND r.status IN ('CONFIRMED', 'PENDING')
             AND (
               (r.start_at < ? AND r.end_at > ?) OR
               (r.start_at BETWEEN ? AND ?) OR
               (r.end_at BETWEEN ? AND ?)
             )) as conflict_count
     FROM resources res
     WHERE res.id != ?
     AND res.status = 'AVAILABLE'
     ORDER BY conflict_count ASC, res.created_at DESC
     LIMIT 5`,
    [endAt, startAt, startAt, endAt, startAt, endAt, resourceId]
  );
  
  return rows.filter(row => row.conflict_count === 0);
};