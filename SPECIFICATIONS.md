# Spécifications fonctionnelles et techniques — Ymmo

## Présentation du projet

Ymmo est une plateforme immobilière ciblant le marché toulousain. Elle permet aux acheteurs de rechercher des biens, aux vendeurs de soumettre leurs biens à des agences, et aux agents immobiliers de gérer leur catalogue en ligne.

---

## Rôles utilisateurs

| Rôle | Description | Accès |
|---|---|---|
| **Acheteur** | Cherche un bien immobilier | Recherche, filtres, rendez-vous, profil |
| **Vendeur** | Propriétaire souhaitant vendre | Soumission de bien, rendez-vous, profil |
| **Agent** | Professionnel immobilier | CRUD biens, rendez-vous, demandes clients |
| **Admin** | Gestionnaire de la plateforme | Tout + gestion agences et références |

---

## Fonctionnalités

### Public (non connecté)

- Consulter la page d'accueil avec biens mis en avant
- Rechercher des biens avec filtres (ville, type, prix, surface, agence)
- Consulter le détail d'un bien
- Consulter la page Marché (statistiques DVF Toulouse)
- Créer un compte (acheteur ou vendeur)
- Se connecter

### Acheteur (connecté)

- Toutes les fonctionnalités publiques
- Prendre un rendez-vous sur un bien
- Consulter ses rendez-vous dans le dashboard
- Gérer son profil

### Vendeur (connecté)

- Toutes les fonctionnalités acheteur
- Soumettre un bien à une agence via le dashboard
- Voir ses rendez-vous

### Agent (connecté)

- Tableau de bord dédié
- Créer, modifier, supprimer des biens
- Consulter les demandes clients
- Consulter les rendez-vous

---

## Endpoints API

### Authentification — `/auth`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Inscription | Non |
| POST | `/auth/login` | Connexion | Non |
| GET | `/auth/me` | Profil connecté | JWT |

### Biens — `/properties`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/properties` | Liste avec filtres | Non |
| GET | `/properties/:id` | Détail d'un bien | Non |
| POST | `/properties` | Créer un bien | Agent/Admin |
| PUT | `/properties/:id` | Modifier un bien | Agent/Admin |
| DELETE | `/properties/:id` | Supprimer un bien | Agent/Admin |

Filtres disponibles : `city`, `type_id`, `status_id`, `agency_id`, `minPrice`, `maxPrice`, `minSurface`, `maxSurface`, `district`

### Agences — `/agencies`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/agencies` | Liste | Non |
| GET | `/agencies/:id` | Détail | Non |
| POST | `/agencies` | Créer | Admin |
| PUT | `/agencies/:id` | Modifier | Admin |
| DELETE | `/agencies/:id` | Supprimer | Admin |

### Rendez-vous — `/appointments`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/appointments` | Liste | JWT |
| GET | `/appointments/:id` | Détail | JWT |
| POST | `/appointments` | Créer | JWT |
| PUT | `/appointments/:id` | Modifier | JWT |
| DELETE | `/appointments/:id` | Supprimer | JWT |

### Références — `/references`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/references/property-types` | Types de biens | Non |
| GET | `/references/property-status` | Statuts | Non |
| POST/PUT/DELETE | `/references/property-types` | Gestion types | Admin |
| POST/PUT/DELETE | `/references/property-status` | Gestion statuts | Admin |

---

## Stack technique

### Backend
- Runtime : Node.js 18+
- Framework : Express.js
- Base de données : MySQL 8 via mysql2 (sans ORM)
- Authentification : JWT (jsonwebtoken)
- Sécurité : bcrypt, helmet, cors, express-rate-limit

### Frontend
- HTML5 sémantique
- Tailwind CSS (CDN)
- JavaScript Vanilla (ES6+)
- Chart.js (page analytics)

### Analyse de données
- Python 3.10+
- pandas, matplotlib, seaborn, scikit-learn
- Source : DVF (Demandes de Valeurs Foncières) — data.gouv.fr

### Versionning
- Git + GitHub
- Stratégie de branches : `develop` + branches `feature/` et `fix/`

---

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- JWT signé avec secret en variable d'environnement
- Rate limiting sur les routes d'authentification (20 req / 15 min)
- Headers sécurisés via helmet
- CORS configuré sur origin autorisée
- Middleware `roleMiddleware` vérifiant les permissions par rôle
- Requêtes SQL paramétrées (protection injection SQL)

---

## Analyse de données

Le notebook `python/ymmo_analyse.ipynb` analyse les transactions immobilières réelles de Toulouse (source DVF 2025) :

- **Nettoyage** : filtrage ventes uniquement, suppression valeurs aberrantes, calcul prix/m²
- **Statistiques** : distribution des prix, évolution mensuelle, volume par trimestre
- **Zones attractives** : prix médian et volume par quartier postal
- **Biens populaires** : répartition par type, surface et nombre de pièces
- **Prédiction** : modèle Random Forest estimant le prix au m² (R² = 0.044, MAE = 1 415 €/m²)

Résultats clés sur 8 706 transactions :
- Prix m² médian appartement : 3 349 €/m²
- Prix m² médian maison : 3 750 €/m²
- Quartier le plus actif : Nord — Les Minimes (2 023 ventes)
- Quartier le plus cher : Centre — Capitole (4 711 €/m²)