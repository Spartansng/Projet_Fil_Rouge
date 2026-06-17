# Guide de déploiement — Ymmo

## Prérequis

- Node.js >= 18
- MySQL >= 8
- Python >= 3.10
- Git

## 1. Cloner le dépôt

```bash
git clone https://github.com/Spartansng/Projet_Fil_Rouge.git
cd Projet_Fil_Rouge
```

## 2. Backend

### Installation des dépendances

```bash
npm install
```

### Configuration de l'environnement

Copier le fichier exemple et remplir les valeurs :

```bash
cp .env.example .env
```

Contenu du `.env` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=ymmo
JWT_SECRET=une_cle_secrete_longue_et_aleatoire
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://127.0.0.1:5500
PORT=3000
```

### Création de la base de données

```sql
CREATE DATABASE ymmo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Importer le schéma SQL depuis Notion ou le fichier `database/schema.sql` :

```bash
mysql -u root -p ymmo < database/schema.sql
```

### Démarrage du serveur

```bash
node js/app.js
```

Le serveur démarre sur `http://localhost:3000`.

Pour le développement avec rechargement automatique :

```bash
npm install -g nodemon
nodemon js/app.js
```

## 3. Frontend

Ouvrir VS Code, clic droit sur `frontend/index.html` → **Open with Live Server**.

Le frontend est accessible sur `http://127.0.0.1:5500`.

## 4. Analyse Python

```bash
cd python
pip install pandas matplotlib seaborn scikit-learn jupyter
python -m jupyterlab
```

Ouvrir `ymmo_analyse.ipynb` et placer le fichier `31555__1_.csv` dans le même dossier.

## 5. Vérification

| Service | URL | Statut attendu |
|---|---|---|
| Backend API | http://localhost:3000/properties | JSON array |
| Frontend | http://127.0.0.1:5500 | Page d'accueil Ymmo |
| JupyterLab | http://localhost:8888 | Interface notebook |

## 6. Comptes de test

Créer un compte via `http://127.0.0.1:5500/pages/register.html` avec le rôle souhaité.

Pour un compte agent, modifier manuellement le rôle en base :

```sql
UPDATE users SET role = 'agent' WHERE email = 'votre@email.fr';
```

## Structure du projet

```
Projet_Fil_Rouge/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   └── pages/
├── js/
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   └── routes/
├── python/
│   └── ymmo_analyse.ipynb
├── .env
├── package.json
└── README.md
```