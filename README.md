# Ymmo — Plateforme immobilière multi-agences

Projet fil rouge B2 (Ynov) — application web de gestion et de mise en relation
pour des agences immobilières multi-sites. Le projet comprend deux volets :
une infrastructure cloud AWS (Terraform/Ansible) et une application web
Node.js / Express / MySQL avec un frontend statique.

## Stack technique

- **Backend** : Node.js, Express.js 5, MySQL (mysql2), JWT (jsonwebtoken), bcrypt
- **Sécurité** : helmet, cors, express-rate-limit, express-validator
- **Frontend** : HTML / CSS (Tailwind CDN) / JavaScript vanilla, Chart.js pour les
  graphiques de marché (`pages/analytics.html`)
- **Base de données** : MySQL — schéma dans [`database/schema.sql`](database/schema.sql)
- **Tests** : Jest + Supertest (`npm test`)

## Structure du projet

```
js/                  Backend Express
├── app.js           Configuration de l'application (middlewares, routes)
├── server.js        Point d'entrée (écoute sur le port 3000)
├── config/db.js     Pool de connexions MySQL
├── controllers/      Logique métier (auth, properties, appointments, agencies, references)
├── middleware/       Authentification JWT, contrôle de rôles, validation des requêtes
└── routes/           Définition des routes Express

frontend/
├── index.html        Page d'accueil
├── pages/            Pages de l'application (login, register, properties, agent-dashboard, ...)
├── js/                Scripts par page + auth.js (gestion du token / utilitaires partagés)
└── css/               Styles personnalisés

database/
└── schema.sql        Schéma MySQL (agencies, users, properties, appointments, ...)

tests/                 Tests Jest (auth, appointments, references)
```

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner les variables (DB, JWT, CORS)
```

Importer le schéma dans MySQL :

```bash
mysql -u root -p < database/schema.sql
```

Lancer le serveur :

```bash
node js/server.js
```

L'API démarre sur `http://localhost:3000`. Le frontend (dossier `frontend/`)
est statique et peut être servi avec n'importe quel serveur HTTP (ex.
extension Live Server, `python3 -m http.server`, ...).

## Tests

```bash
npm test
```

## Rôles applicatifs

| Rôle       | Description                                                        |
|------------|---------------------------------------------------------------------|
| `acheteur` | Utilisateur final : recherche de biens, prise de rendez-vous        |
| `vendeur`  | Peut soumettre un bien à la vente via son espace personnel          |
| `agent`    | Gère les biens et rendez-vous de sa propre agence                   |
| `admin`    | Accès complet (agences, types/statuts de biens, tous les biens)     |

## Sécurité

Un audit de sécurité a été réalisé sur l'API et le frontend (voir
`audit_securite_ymmo.docx`) : contrôle d'accès par rôle (RBAC), correction des
failles IDOR/BOLA, validation des entrées, échappement des données dynamiques
côté frontend (prévention XSS), helmet/CORS/rate limiting.
