-- Base de données SGRE-App
-- Script d'initialisation avec données d'exemple

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS sgre_db;
USE sgre_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Stocké en clair (conformément à la demande)
  full_name VARCHAR(255),
  role ENUM('ADMIN','MANAGER','CLIENT') DEFAULT 'CLIENT',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_email (email),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des ressources
CREATE TABLE IF NOT EXISTS resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  capacity INT DEFAULT 1,
  location VARCHAR(255),
  status ENUM('AVAILABLE','MAINTENANCE','UNAVAILABLE') DEFAULT 'AVAILABLE',
  attributes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id BIGINT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  location VARCHAR(255),
  status ENUM('DRAFT','SCHEDULED','ONGOING','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizer (organizer_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT NULL,
  resource_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  status ENUM('PENDING','CONFIRMED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_resource (resource_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_at, end_at),
  INDEX idx_resource_dates (resource_id, start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des participants aux événements
CREATE TABLE IF NOT EXISTS participants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  status ENUM('CONFIRMED','WAITING','CANCELLED') DEFAULT 'CONFIRMED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_event_user (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_event (event_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (read_at),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  object_type VARCHAR(50) NOT NULL,
  object_id BIGINT NULL,
  detail JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_object (object_type, object_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des données d'exemple

-- Utilisateurs (mots de passe en clair)
INSERT INTO users (email, password, role) VALUES ('admin@sgre.test','<hash>','admin')
ON DUPLICATE KEY UPDATE id = id; -- no-op si déjà présent
INSERT INTO users (email, password, full_name, role, is_active) VALUES
('admin@sgre.test', 'admin123', 'Administrateur Principal', 'ADMIN', 1),
('manager@sgre.test', 'manager123', 'Manager Événements', 'MANAGER', 1),
('client1@sgre.test', 'client123', 'Jean Dupont', 'CLIENT', 1),
('client2@sgre.test', 'client123', 'Marie Martin', 'CLIENT', 1),
('client3@sgre.test', 'client123', 'Pierre Durand', 'CLIENT', 1);

-- Ressources
INSERT INTO resources (name, type, capacity, location, status, attributes) VALUES
('Salle de Conférence A', 'SALLE', 50, 'Bâtiment A, Étage 1', 'AVAILABLE', '{"equipment": ["projecteur", "écran", "wifi", "climatisation"], "access": ["handicapé"]}'),
('Salle de Réunion B', 'SALLE', 10, 'Bâtiment B, Étage 2', 'AVAILABLE', '{"equipment": ["tableau blanc", "wifi"], "access": ["standard"]}'),
('Projecteur HD', 'EQUIPEMENT', 1, 'Stock Équipements', 'AVAILABLE', '{"type": "vidéoprojecteur", "resolution": "1920x1080", "lumens": 4000}'),
('Véhicule de Service', 'VEHICULE', 5, 'Parking Principal', 'AVAILABLE', '{"type": "minibus", "fuel": "diesel", "license": "B"}'),
('Kit Vidéoconférence', 'EQUIPEMENT', 1, 'Bureau IT', 'AVAILABLE', '{"equipment": ["caméra", "micro", "haut-parleurs"], "compatibility": ["teams", "zoom"]}');

-- Événements
INSERT INTO events (title, description, organizer_id, start_at, end_at, location, status) VALUES
('Conférence Annuelle', 'Conférence annuelle sur les nouvelles technologies', 1, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY + 3 HOUR), 'Salle de Conférence A', 'SCHEDULED'),
('Formation Management', 'Formation aux techniques de management moderne', 2, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + 6 HOUR), 'Salle de Réunion B', 'SCHEDULED'),
('Réunion Équipe', 'Réunion hebdomadaire de l équipe projet', 2, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + 2 HOUR), 'Salle de Réunion B', 'SCHEDULED');

-- Participants aux événements
INSERT INTO participants (event_id, user_id, status) VALUES
(1, 3, 'CONFIRMED'),
(1, 4, 'CONFIRMED'),
(1, 5, 'CONFIRMED'),
(2, 3, 'CONFIRMED'),
(2, 4, 'CONFIRMED'),
(3, 2, 'CONFIRMED'),
(3, 3, 'CONFIRMED');

-- Réservations
INSERT INTO reservations (event_id, resource_id, user_id, start_at, end_at, status) VALUES
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY + 3 HOUR), 'CONFIRMED'),
(2, 2, 2, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + 6 HOUR), 'CONFIRMED'),
(NULL, 3, 3, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + 4 HOUR), 'PENDING'),
(NULL, 4, 4, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY + 8 HOUR), 'CONFIRMED');

-- Notifications d'exemple
INSERT INTO notifications (user_id, title, message, read_at) VALUES
(3, 'Bienvenue sur SGRE-App', 'Votre compte a été créé avec succès. Bienvenue sur notre plateforme!', NOW()),
(3, 'Réservation en attente', 'Votre réservation du projecteur HD est en attente de validation.', NULL),
(4, 'Bienvenue sur SGRE-App', 'Votre compte a été créé avec succès. Bienvenue sur notre plateforme!', NOW()),
(4, 'Réservation confirmée', 'Votre réservation du véhicule de service a été confirmée.', NOW()),
(2, 'Nouvelle réservation', 'Une nouvelle réservation nécessite votre validation.', NULL);

-- Logs d'audit d'exemple
INSERT INTO audit_logs (user_id, action, object_type, object_id, detail) VALUES
(1, 'CREATE_USER', 'USER', 2, '{"email": "manager@sgre.test", "role": "MANAGER"}'),
(1, 'CREATE_RESOURCE', 'RESOURCE', 1, '{"name": "Salle de Conférence A", "type": "SALLE"}'),
(2, 'CREATE_EVENT', 'EVENT', 1, '{"title": "Conférence Annuelle", "status": "SCHEDULED"}'),
(3, 'CREATE_RESERVATION', 'RESERVATION', 3, '{"resource_id": 3, "status": "PENDING"}'),
(2, 'CONFIRM_RESERVATION', 'RESERVATION', 4, '{"previous_status": "PENDING", "new_status": "CONFIRMED"}');