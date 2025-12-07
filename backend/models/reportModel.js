/**
 * Modèle pour la génération de rapports
 */

const db = require('../config/db');

/**
 * Statistiques d'utilisation des ressources
 */
exports.getResourceUsage = async (startDate, endDate) => {
  let query = `
    SELECT 
      res.id,
      res.name,
      res.type,
      COUNT(r.id) as reservation_count,
      SUM(TIMESTAMPDIFF(HOUR, r.start_at, r.end_at)) as total_hours,
      AVG(TIMESTAMPDIFF(HOUR, r.start_at, r.end_at)) as avg_hours_per_reservation,
      MIN(r.start_at) as first_reservation,
      MAX(r.start_at) as last_reservation
    FROM resources res
    LEFT JOIN reservations r ON res.id = r.resource_id
    WHERE r.status = 'CONFIRMED'
  `;
  
  const params = [];
  
  if (startDate) {
    query += ' AND r.start_at >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND r.end_at <= ?';
    params.push(endDate);
  }
  
  query += ' GROUP BY res.id ORDER BY reservation_count DESC';
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Statistiques des événements
 */
exports.getEventStatistics = async (startDate, endDate) => {
  let query = `
    SELECT 
      status,
      COUNT(*) as event_count,
      AVG(TIMESTAMPDIFF(HOUR, start_at, end_at)) as avg_duration_hours,
      MIN(start_at) as earliest_event,
      MAX(start_at) as latest_event,
      COUNT(DISTINCT organizer_id) as unique_organizers,
      SUM(participant_count) as total_participants
    FROM (
      SELECT 
        e.*,
        COUNT(p.id) as participant_count
      FROM events e
      LEFT JOIN participants p ON e.id = p.event_id
      WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    query += ' AND e.start_at >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND e.end_at <= ?';
    params.push(endDate);
  }
  
  query += ` GROUP BY e.id
    ) as events_with_participants
    GROUP BY status
    ORDER BY FIELD(status, 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DRAFT')`;
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Activité des utilisateurs
 */
exports.getUserActivity = async (startDate, endDate) => {
  let query = `
    SELECT 
      u.id,
      u.email,
      u.full_name,
      u.role,
      COUNT(DISTINCT r.id) as reservation_count,
      COUNT(DISTINCT e.id) as event_organized_count,
      COUNT(DISTINCT p.event_id) as event_participation_count,
      COUNT(DISTINCT al.id) as audit_action_count,
      MAX(al.created_at) as last_activity
    FROM users u
    LEFT JOIN reservations r ON u.id = r.user_id AND r.status = 'CONFIRMED'
    LEFT JOIN events e ON u.id = e.organizer_id
    LEFT JOIN participants p ON u.id = p.user_id
    LEFT JOIN audit_logs al ON u.id = al.user_id
    WHERE u.is_active = 1
  `;
  
  const params = [];
  
  if (startDate) {
    query += ' AND (r.start_at >= ? OR e.start_at >= ? OR al.created_at >= ?)';
    params.push(startDate, startDate, startDate);
  }
  
  if (endDate) {
    query += ' AND (r.end_at <= ? OR e.end_at <= ? OR al.created_at <= ?)';
    params.push(endDate, endDate, endDate);
  }
  
  query += ` GROUP BY u.id
    ORDER BY reservation_count DESC, event_organized_count DESC`;
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Logs d'audit
 */
exports.getAuditLogs = async (filters) => {
  let query = `
    SELECT al.*,
           u.email as user_email,
           u.full_name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.user_id) {
    query += ' AND al.user_id = ?';
    params.push(filters.user_id);
  }
  
  if (filters.action) {
    query += ' AND al.action = ?';
    params.push(filters.action);
  }
  
  if (filters.start_date) {
    query += ' AND al.created_at >= ?';
    params.push(filters.start_date);
  }
  
  if (filters.end_date) {
    query += ' AND al.created_at <= ?';
    params.push(filters.end_date);
  }
  
  query += ' ORDER BY al.created_at DESC';
  
  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Réservations pour manager
 */
exports.getManagerReservations = async (filters) => {
  let query = `
    SELECT r.*,
           res.name as resource_name,
           res.type as resource_type,
           u.full_name as user_name,
           u.email as user_email
    FROM reservations r
    LEFT JOIN resources res ON r.resource_id = res.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.status IN ('PENDING', 'CONFIRMED')
  `;
  
  const params = [];
  
  if (filters.status) {
    query += ' AND r.status = ?';
    params.push(filters.status);
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
 * Événements pour manager
 */
exports.getManagerEvents = async (filters) => {
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