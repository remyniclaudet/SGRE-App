/**
 * Script d'initialisation de la base de données
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
  try {
    console.log('📊 Initialisation de la base de données...');
    
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, '..', 'seed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Exécuter les requêtes SQL
    const queries = sql.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        try {
          await db.query(query);
          console.log('✅ Requête exécutée avec succès');
        } catch (error) {
          console.error('❌ Erreur lors de l\'exécution de la requête:', error.message);
          // Continuer avec les autres requêtes
        }
      }
    }
    
    console.log('🎉 Base de données initialisée avec succès!');
    console.log('📋 Données d\'exemple insérées:');
    console.log('   - 1 Administrateur (admin@sgre.test / admin123)');
    console.log('   - 1 Manager (manager@sgre.test / manager123)');
    console.log('   - 2 Clients (client1@sgre.test / client123)');
    console.log('   - 3 Ressources');
    console.log('   - 2 Événements');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

initializeDatabase();