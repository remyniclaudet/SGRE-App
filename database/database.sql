-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ressources_management;
USE ressources_management;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Table des ressources
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category_id INT,
    status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available',
    description TEXT,
    capacity INT,
    location VARCHAR(200),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des événements
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(200),
    manager_id INT,
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Table de liaison événements-ressources
CREATE TABLE event_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    resource_id INT,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- Table des réservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    event_id INT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Table des notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_type ENUM('reservation', 'event', 'resource', 'system'),
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de configuration
CREATE TABLE site_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des données initiales
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('Manager User', 'manager@example.com', 'manager123', 'manager'),
('Client User', 'client@example.com', 'client123', 'client');

INSERT INTO categories (name) VALUES
('Salles'),
('Véhicules'),
('Équipements'),
('Matériel Informatique'),
('Mobilier');

INSERT INTO resources (name, type, category_id, status, description, capacity, location, created_by) VALUES
('Salle de conférence A', 'Salle', 1, 'available', 'Grande salle équipée pour conférences', 50, 'Bâtiment A - Étage 1', 1),
('Voiture de service', 'Véhicule', 2, 'available', 'Voiture 5 places pour déplacements professionnels', 5, 'Parking principal', 2),
('Projecteur HD', 'Équipement', 3, 'available', 'Projecteur haute définition 3000 lumens', NULL, 'Stock audiovisuel', 1),
('Ordinateur portable', 'Matériel', 4, 'available', 'PC portable pour présentations', NULL, 'Bureau IT', 2),
('Salle de réunion B', 'Salle', 1, 'available', 'Petite salle pour réunions d équipe', 10, 'Bâtiment B - Étage 2', 1);

INSERT INTO events (title, description, date, location, manager_id, status, is_public) VALUES
('Réunion trimestrielle', 'Révision des objectifs trimestriels', DATE_ADD(NOW(), INTERVAL 7 DAY), 'Salle de conférence A', 2, 'planned', TRUE),
('Formation équipe', 'Formation sur les nouveaux outils', DATE_ADD(NOW(), INTERVAL 3 DAY), 'Salle de réunion B', 2, 'planned', TRUE),
('Événement client', 'Présentation produit aux clients', DATE_ADD(NOW(), INTERVAL 14 DAY), 'Auditorium principal', 2, 'planned', TRUE);

INSERT INTO reservations (user_id, resource_id, event_id, start_date, end_date, status, notes) VALUES
(3, 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 7 DAY), INTERVAL 2 HOUR), 'confirmed', 'Réunion équipe'),
(3, 3, NULL, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 4 HOUR), 'pending', 'Besoin pour présentation');

INSERT INTO notifications (user_id, title, message, type, is_read, related_type, related_id) VALUES
(2, 'Nouvelle réservation', 'Une nouvelle réservation a été effectuée pour le projecteur HD', 'info', FALSE, 'reservation', 2),
(3, 'Réservation confirmée', 'Votre réservation pour la salle de conférence A a été confirmée', 'success', TRUE, 'reservation', 1);

INSERT INTO site_config (setting_key, setting_value) VALUES
('site_name', 'Ressources Management System'),
('site_logo', '/logo.png'),
('contact_email', 'contact@example.com'),
('contact_phone', '+33 1 23 45 67 89');