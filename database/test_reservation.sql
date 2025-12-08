USE ressources_management;

-- Ajouter des réservations de test
INSERT INTO reservations (user_id, resource_id, start_date, end_date, status, notes) VALUES
(3, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + INTERVAL 2 HOUR), 'confirmed', 'Réunion d équipe'),
(3, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + INTERVAL 4 HOUR), 'pending', 'Déplacement professionnel'),
(3, 3, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + INTERVAL 3 HOUR), 'confirmed', 'Présentation client');

-- Mettre à jour certaines ressources comme indisponibles
UPDATE resources SET status = 'maintenance' WHERE id = 4;
UPDATE resources SET status = 'unavailable' WHERE id = 5;

-- Ajouter plus de ressources
INSERT INTO resources (name, type, category_id, status, description, capacity, location, created_by) VALUES
('Salle de formation', 'Salle', 1, 'available', 'Salle équipée pour formations', 25, 'Bâtiment C - Étage 3', 1),
('Camionnette', 'Véhicule', 2, 'available', 'Camionnette pour transport de matériel', 3, 'Parking secondaire', 2),
('Écran tactile', 'Équipement', 3, 'available', 'Écran tactile 65 pouces', NULL, 'Salle multimédia', 1);