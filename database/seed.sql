INSERT INTO property_types (name) VALUES 
('Appartement'), ('Maison'), ('Terrain'), ('Commerce'), ('Loft');

INSERT INTO property_status (name) VALUES 
('Disponible'), ('Sous compromis'), ('Vendu'), ('En attente');

INSERT INTO agencies (name, city, address) VALUES 
('Ymmo Capitole', 'Toulouse', '14 rue de la Bourse, 31000'),
('Ymmo Aix-en-Provence', 'Aix-en-Provence', '15 cours Mirabeau, 13100'),
('Ymmo Nîmes', 'Nîmes', '8 boulevard Victor Hugo, 30000'),
('Ymmo Marseille', 'Marseille', '32 La Canebière, 13001');

-- Biens Toulouse
INSERT INTO properties (title, description, price, surface, city, postal_code, address, district, type_id, agency_id, status_id) VALUES 
('T3 lumineux Capitole', 'Bel appartement au coeur de Toulouse', 285000, 67, 'Toulouse', '31000', '12 rue de la Bourse', 'Capitole', 1, 1, 1),
('Maison Saint-Cyprien', 'Maison de ville avec jardin', 510000, 130, 'Toulouse', '31300', '5 allée Charles de Fitte', 'Saint-Cyprien', 2, 1, 1),
('Studio Rangueil', 'Studio étudiant proche université', 129000, 32, 'Toulouse', '31400', '120 route de Narbonne', 'Rangueil', 1, 1, 1),
('Loft Compans', 'Loft architecte vue dégagée', 390000, 95, 'Toulouse', '31000', '3 rue Compans', 'Compans', 1, 1, 1),
('Villa Colomiers', 'Villa avec piscine et jardin', 745000, 220, 'Colomiers', '31770', '10 avenue de Lombez', 'Centre', 2, 1, 1),
-- Biens Aix-en-Provence
('T4 lumineux Mazarin', 'Appartement bourgeois avec moulures et parquet ancien', 420000, 95, 'Aix-en-Provence', '13100', '12 rue Mazarin', 'Mazarin', 1, 2, 1),
('Maison avec piscine Aix', 'Bastide provençale avec piscine et terrain', 890000, 180, 'Aix-en-Provence', '13100', '45 route des Milles', 'Les Milles', 2, 2, 1),
('Studio Aix centre', 'Studio idéal investissement locatif', 145000, 28, 'Aix-en-Provence', '13100', '3 rue des Cordeliers', 'Centre', 1, 2, 1),
-- Biens Nîmes
('Appartement Carré d''Or', 'T3 rénové proche arènes', 235000, 72, 'Nîmes', '30000', '5 rue de la Madeleine', 'Centre historique', 1, 3, 1),
('Maison de ville Nîmes', 'Maison avec terrasse et garage', 310000, 110, 'Nîmes', '30000', '18 avenue Feuchères', 'Gambetta', 2, 3, 1),
('T2 investisseur Nîmes', 'Proche université bon rendement locatif', 119000, 45, 'Nîmes', '30900', '7 rue Nationale', 'Pissevin', 1, 3, 1),
-- Biens Marseille
('T3 Vieux-Port Marseille', 'Vue mer imprenable', 380000, 68, 'Marseille', '13007', '2 quai de Rive Neuve', 'Vieux-Port', 1, 4, 1),
('Villa Malmousque', 'Villa avec accès mer privé', 1250000, 220, 'Marseille', '13007', '10 corniche Kennedy', 'Malmousque', 2, 4, 1),
('Studio Castellane', 'Studio meublé centre ville', 98000, 25, 'Marseille', '13006', '14 rue Paradis', 'Castellane', 1, 4, 1),
('T4 Périer Marseille', 'Grand appartement quartier résidentiel', 495000, 115, 'Marseille', '13008', '22 avenue du Prado', 'Périer', 1, 4, 1);