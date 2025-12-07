/**
 * Modèle pour la gestion des événements
 */

const db = require('../config/db');

/**
 * Récupérer tous les événements
 */
exports.getAllEvents = async (filters = {}) => {
  let query = `
    SELECT e.*, 
           u.full_name as organizer_name,
           COUNT(DISTINCT p.id) as participant_count
    FROM events e
    LEFT JOIN users u ON e.organizer_id = u.id
    LEFT JOIN participants p ON e.id = p.event_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.status) {
    query += ' AND e.status = ?';
    params.push(filters.status);
  }
  
  if (filters.organizer_id) {
    query += ' AND e.organizer_id = ?';
    params.push(filters.organizer_id);
  }
  
  if (filters.start_date) {
    query += ' AND e.start_at >= ?';
    params.push(filters.start_date);
  }
  
  if (filters.end_date) {
    query += ' AND e.end_at <= ?';
    params.push(filters.end_date);
  }
  
  query += ' GROUP BY e.id ORDER BY e.start_at ASC';
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Récupérer un événement par ID
 */
exports.getEventById = async (id) => {
  const [rows] = await db.query(
    `SELECT e.*, 
            u.full_name as organizer_name,
            u.email as organizer_email
     FROM events e
     LEFT JOIN users u ON e.organizer_id = u.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Créer un nouvel événement
 */
exports.createEvent = async (eventData) => {
  const { title, description, organizer_id, start_at, end_at, location, status } = eventData;
  
  const [result] = await db.query(
    `INSERT INTO events (title, description, organizer_id, start_at, end_at, location, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, organizer_id, start_at, end_at, location, status]
  );
  
  return result.insertId;
};

/**
 * Mettre à jour un événement
 */
exports.updateEvent = async (id, updateData) => {
  const fields = [];
  const values = [];
  
  Object.keys(updateData).forEach(key => {
    fields.push(`${key} = ?`);
    values.push(updateData[key]);
  });
  
  values.push(id);
  
  const [result] = await db.query(
    `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

/**
 * Supprimer un événement
 */
exports.deleteEvent = async (id) => {
  const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

/**
 * Ajouter un participant à un événement
 */
exports.addParticipant = async (participantData) => {
  const { event_id, user_id, status = 'CONFIRMED' } = participantData;
  
  const [result] = await db.query(
    `INSERT INTO participants (event_id, user_id, status) 
     VALUES (?, ?, ?)`,
    [event_id, user_id, status]
  );
  
  return result.insertId;
};

/**
 * Retirer un participant d'un événement
 */
exports.removeParticipant = async (eventId, userId) => {
  const [result] = await db.query(
    'DELETE FROM participants WHERE event_id = ? AND user_id = ?',
    [eventId, userId]
  );
  return result.affectedRows > 0;
};

/**
 * Récupérer les participants d'un événement
 */
exports.getEventParticipants = async (eventId) => {
  const [rows] = await db.query(
    `SELECT p.*, u.full_name, u.email
     FROM participants p
     LEFT JOIN users u ON p.user_id = u.id
     WHERE p.event_id = ?
     ORDER BY p.created_at DESC`,
    [eventId]
  );
  return rows;
};

/**
 * Vérifier si un utilisateur est participant
 */
exports.getParticipant = async (eventId, userId) => {
  const [rows] = await db.query(
    'SELECT * FROM participants WHERE event_id = ? AND user_id = ?',
    [eventId, userId]
  );
  return rows[0];
};