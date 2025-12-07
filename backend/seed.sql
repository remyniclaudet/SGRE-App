-- backend/seed.sql - CORRIGÉ
USE sgre_db;

-- Supprimer les tables existantes
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Stocké en clair
  full_name VARCHAR(255),
  role ENUM('ADMIN','MANAGER','CLIENT') DEFAULT 'CLIENT',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des ressources
CREATE TABLE resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  capacity INT DEFAULT 1,
  location VARCHAR(255),
  status ENUM('AVAILABLE','MAINTENANCE','UNAVAILABLE') DEFAULT 'AVAILABLE',
  description TEXT,
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des événements
CREATE TABLE events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id BIGINT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  location VARCHAR(255),
  status ENUM('DRAFT','SCHEDULED','ONGOING','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
  max_participants INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id),
  INDEX idx_organizer (organizer_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des réservations
CREATE TABLE reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT NULL,
  resource_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  status ENUM('PENDING','CONFIRMED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_resource (resource_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des participants aux événements
CREATE TABLE participants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  status ENUM('CONFIRMED','WAITING','CANCELLED') DEFAULT 'CONFIRMED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_event_user (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_event (event_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des notifications
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('RESERVATION','EVENT','SYSTEM','OTHER') DEFAULT 'SYSTEM',
  read_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des logs d'audit
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  object_type VARCHAR(50) NOT NULL,
  object_id BIGINT NULL,
  detail JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion des données d'exemple
INSERT INTO users (email, password, full_name, role, is_active) VALUES
('admin@sgre.test', 'admin123', 'Administrateur Principal', 'ADMIN', 1),
('manager1@sgre.test', 'manager123', 'Manager Événements', 'MANAGER', 1),
('manager2@sgre.test', 'manager123', 'Manager Ressources', 'MANAGER', 1),
('client1@sgre.test', 'client123', 'Jean Dupont', 'CLIENT', 1),
('client2@sgre.test', 'client123', 'Marie Martin', 'CLIENT', 1),
('client3@sgre.test', 'client123', 'Pierre Durand', 'CLIENT', 1);

-- Ressources
INSERT INTO resources (name, type, capacity, location, status, description, created_by) VALUES
('Salle de Conférence A', 'SALLE', 50, 'Bâtiment A, Étage 1', 'AVAILABLE', 'Salle équipée avec projecteur, écran et système audio', 1),
('Salle de Réunion B', 'SALLE', 12, 'Bâtiment B, Étage 2', 'AVAILABLE', 'Salle de réunion standard avec tableau blanc', 2),
('Projecteur HD', 'EQUIPEMENT', 1, 'Stock Équipements', 'AVAILABLE', 'Projecteur HD 4000 lumens avec câbles HDMI', 2),
('Véhicule de Service', 'VEHICULE', 7, 'Parking Principal', 'AVAILABLE', 'Minibus 7 places, permis B requis', 1),
('Kit Vidéoconférence', 'EQUIPEMENT', 1, 'Bureau IT', 'MAINTENANCE', 'Caméra, micro et haut-parleurs pour visio', 2),
('Salle Formation', 'SALLE', 25, 'Bâtiment C, RDC', 'UNAVAILABLE', 'En rénovation jusqu\'au 15/01', 1);

-- Événements
INSERT INTO events (title, description, organizer_id, start_at, end_at, location, status, max_participants) VALUES
('Conférence Annuelle', 'Conférence annuelle sur les innovations technologiques', 1, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY + 3 HOUR), 'Salle de Conférence A', 'SCHEDULED', 50),
('Formation Management', 'Formation aux techniques de management moderne', 2, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + 6 HOUR), 'Salle de Réunion B', 'SCHEDULED', 12),
('Réunion Équipe Projet', 'Réunion hebdomadaire de suivi du projet X', 2, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + 2 HOUR), 'Salle de Réunion B', 'SCHEDULED', 8);

-- Participants aux événements
INSERT INTO participants (event_id, user_id, status) VALUES
(1, 4, 'CONFIRMED'),
(1, 5, 'CONFIRMED'),
(1, 6, 'CONFIRMED'),
(2, 4, 'CONFIRMED'),
(2, 5, 'CONFIRMED'),
(3, 2, 'CONFIRMED'),
(3, 4, 'CONFIRMED');

-- Réservations
INSERT INTO reservations (event_id, resource_id, user_id, start_at, end_at, status, reason) VALUES
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY + 3 HOUR), 'CONFIRMED', 'Conférence annuelle'),
(2, 2, 2, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + 6 HOUR), 'CONFIRMED', 'Formation management'),
(NULL, 3, 4, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + 4 HOUR), 'PENDING', 'Présentation client'),
(NULL, 4, 5, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY + 8 HOUR), 'CONFIRMED', 'Transport équipe');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, read_at) VALUES
(4, 'Bienvenue sur SGRE-App', 'Votre compte client a été créé avec succès !', 'SYSTEM', NOW()),
(4, 'Réservation en attente', 'Votre réservation du projecteur HD est en attente de validation.', 'RESERVATION', NULL),
(5, 'Réservation confirmée', 'Votre réservation du véhicule de service a été confirmée.', 'RESERVATION', NOW()),
(2, 'Nouvelle réservation', 'Une nouvelle réservation nécessite votre validation.', 'RESERVATION', NULL),
(1, 'Rapport mensuel', 'Le rapport d\'activité du mois est disponible.', 'SYSTEM', NOW());

-- Logs d'audit
INSERT INTO audit_logs (user_id, action, object_type, object_id, detail) VALUES
(1, 'CREATE_USER', 'USER', 2, '{"email": "manager1@sgre.test", "role": "MANAGER"}'),
(1, 'CREATE_RESOURCE', 'RESOURCE', 1, '{"name": "Salle de Conférence A", "type": "SALLE"}'),
(2, 'CREATE_EVENT', 'EVENT', 1, '{"title": "Conférence Annuelle", "status": "SCHEDULED"}'),
(4, 'CREATE_RESERVATION', 'RESERVATION', 3, '{"resource_id": 3, "status": "PENDING"}'),
(2, 'CONFIRM_RESERVATION', 'RESERVATION', 4, '{"previous_status": "PENDING", "new_status": "CONFIRMED"}');

SELECT '✅ Base de données initialisée avec succès !' as message;
SELECT CONCAT('👤 ', COUNT(*), ' utilisateurs créés') FROM users;
SELECT CONCAT('🏢 ', COUNT(*), ' ressources créées') FROM resources;
SELECT CONCAT('📅 ', COUNT(*), ' événements créés') FROM events;