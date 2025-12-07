/**
 * Modèle pour la gestion des logs d'audit
 */

const db = require('../config/db');

/**
 * Enregistrer une action d'audit
 */
exports.logAction = async (auditData) => {
  const { user_id, action, object_type, object_id, detail } = auditData;
  
  const [result] = await db.query(
    `INSERT INTO audit_logs (user_id, action, object_type, object_id, detail) 
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, action, object_type, object_id, JSON.stringify(detail)]
  );
  
  return result.insertId;
};

/**
 * Récupérer les logs d'audit
 */
exports.getAuditLogs = async (filters = {}) => {
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
  
  if (filters.object_type) {
    query += ' AND al.object_type = ?';
    params.push(filters.object_type);
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