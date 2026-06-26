# SOS Fès — Application de Gestion de Pointage

Application web professionnelle de gestion du pointage quotidien pour SOS Fès
(propreté urbaine), avec gestion multi-secteurs, rôles Admin / Responsable,
tableau de bord avec statistiques, rapports PDF/Excel, et interface bilingue
Français / Arabe (RTL).

## 1. Stack technique

| Couche          | Technologie                         |
|-----------------|--------------------------------------|
| Frontend        | React.js (Vite) + Tailwind CSS       |
| Backend         | Node.js + Express.js                 |
| Base de données | MongoDB (Mongoose)                   |
| Auth            | JWT + bcrypt                         |
| Graphiques      | Chart.js (react-chartjs-2)           |
| Rapports        | PDFKit (PDF) + ExcelJS (Excel)       |
| Icônes          | lucide-react                         |

## 2. Structure du projet

```
sos-fes-pointage/
├── backend/
│   ├── config/db.js               # Connexion MongoDB
│   ├── models/                    # User, Secteur, Agent, Pointage
│   ├── middleware/                # auth.js (JWT), role.js (RBAC)
│   ├── controllers/                # Logique métier par ressource
│   ├── routes/                    # Routes Express par ressource
│   ├── utils/                     # generatePdf.js, generateExcel.js
│   ├── seed/seed.js                # Données de démonstration JNANAT 1
│   ├── server.js                   # Point d'entrée Express
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js             # Client HTTP + intercepteur JWT
    │   ├── context/AuthContext.jsx  # Authentification
    │   ├── i18n/                    # fr.json, ar.json, I18nContext
    │   ├── components/              # Sidebar, Navbar, tableaux, modals, charts
    │   ├── pages/                   # Login, Dashboard, Agents, Secteurs, ...
    │   └── App.jsx / main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## 3. Prérequis

- Node.js ≥ 18
- MongoDB (local via `mongod`, ou un cluster MongoDB Atlas gratuit)
- npm

## 4. Installation du Backend

```bash
cd backend
npm install
cp .env.example .env
```

Modifiez `.env` si nécessaire :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sos_fes_pointage
JWT_SECRET=change_this_secret_key_in_production
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

Démarrez MongoDB localement (ou utilisez une URI Atlas dans `MONGO_URI`),
puis injectez les données de démonstration (secteurs, agents JNANAT 1,
comptes admin/responsables, 14 jours de pointages) :

```bash
npm run seed
```

Cela affichera les comptes de connexion créés :

```
Admin       -> identifiant: admin           mot de passe: Admin@2026
Responsable -> identifiant: resp.jnanat1     mot de passe: Resp@2026
```

Démarrez le serveur :

```bash
npm run dev      # avec nodemon (rechargement auto)
# ou
npm start
```

L'API est disponible sur **http://localhost:5000/api** (vérifiez avec
`GET /api/health`).

## 5. Installation du Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur **http://localhost:5173**.
Le proxy Vite redirige automatiquement `/api/*` vers `http://localhost:5000`
(voir `vite.config.js`), donc aucune configuration CORS supplémentaire n'est
nécessaire en développement.

Pour un build de production :

```bash
npm run build      # génère le dossier dist/
npm run preview    # pour tester le build localement
```

Servez ensuite le contenu de `dist/` avec n'importe quel serveur statique
(Nginx, Apache, Vercel, Netlify...) en pointant `VITE`/votre proxy ou un
reverse-proxy vers l'API Express en production.

## 6. Comptes de démonstration

| Rôle        | Identifiant        | Mot de passe |
|-------------|---------------------|--------------|
| Admin       | `admin`             | `Admin@2026` |
| Responsable JNANAT 1 | `resp.jnanat1` | `Resp@2026` |
| Responsable JNANAT 2 | `resp.jnanat2` | `Resp@2026` |
| Responsable CEINTURE | `resp.ceinture`| `Resp@2026` |
| Responsable ATLAS    | `resp.atlas`   | `Resp@2026` |
| Responsable ZOUAGHA  | `resp.zouagha` | `Resp@2026` |

> ⚠️ Changez ces mots de passe avant toute mise en production.

## 7. Fonctionnalités principales

### Administrateur
- Gestion complète des secteurs (CRUD)
- Gestion complète des agents (CRUD), filtrage par secteur/recherche
- Gestion des responsables (création de comptes, assignation à un secteur)
- Consultation de tous les pointages, tous secteurs confondus
- Génération de rapports PDF (registre identique au format papier)
- Export Excel (par date, par secteur, par agent/période)
- Statistiques globales et alertes

### Responsable de secteur
- Connexion sécurisée, accès limité à son propre secteur (vérifié côté API)
- Saisie quotidienne du pointage (statut, heure d'entrée/sortie, observation)
- Historique des présences filtrable par période
- Génération de rapports pour son secteur

### Sécurité
- Mots de passe hashés avec **bcrypt**
- Authentification par **JWT** (expiration configurable)
- Middleware `protect` (vérification du token) et `allowRoles` (RBAC)
- Un responsable ne peut jamais lire/modifier les données d'un autre secteur
  (vérifié au niveau des contrôleurs, pas seulement de l'UI)

### Interface
- Sidebar fixe (desktop) / rétractable (mobile-tablette)
- Cartes statistiques + 3 graphiques Chart.js (présence/jour, présence/secteur,
  absences mensuelles)
- Tableau de pointage filtrable et modifiable en ligne
- Bascule Français ⇄ Arabe avec inversion automatique du sens de lecture (RTL)
- Palette de couleurs : bleu foncé (`#0B3D66`), vert SOS (`#1F9D55`), blanc

## 8. Principales routes API

| Méthode | Route                              | Accès               | Description |
|---------|--------------------------------------|----------------------|--------------|
| POST    | `/api/auth/login`                    | Public               | Connexion |
| GET     | `/api/auth/me`                       | Authentifié          | Profil courant |
| GET     | `/api/secteurs`                      | Authentifié          | Liste des secteurs |
| POST/PUT/DELETE | `/api/secteurs/:id`         | Admin                | CRUD secteurs |
| GET     | `/api/agents`                        | Authentifié (scopé)  | Liste des agents |
| POST/PUT/DELETE | `/api/agents/:id`           | Admin                | CRUD agents |
| GET     | `/api/users?role=responsable`        | Admin                | Liste des responsables |
| POST/PUT/DELETE | `/api/users/:id`             | Admin                | CRUD responsables |
| GET     | `/api/pointages`                     | Authentifié (scopé)  | Historique des pointages |
| POST    | `/api/pointages/bulk`                | Admin/Responsable    | Saisie quotidienne (un secteur) |
| GET     | `/api/pointages/alerts`              | Authentifié          | Alertes (absences, retards) |
| GET     | `/api/stats/overview`                | Authentifié          | Cartes statistiques |
| GET     | `/api/stats/presence-par-jour`       | Authentifié          | Données graphique |
| GET     | `/api/stats/presence-par-secteur`    | Authentifié          | Données graphique |
| GET     | `/api/stats/absences-mensuelles`     | Authentifié          | Données graphique |
| GET     | `/api/reports/pdf?secteur=&date=`    | Authentifié (scopé)  | Registre PDF |
| GET     | `/api/reports/excel?type=&...`       | Authentifié (scopé)  | Export Excel |

## 9. Déploiement en production (suggestion)

1. MongoDB Atlas (cluster gratuit ou dédié)
2. Backend : déployer sur un VPS / Render / Railway, définir les variables
   d'environnement (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`)
3. Frontend : `npm run build`, déployer `dist/` sur Vercel/Netlify ou via Nginx
4. Configurer un reverse-proxy (Nginx) pour servir le frontend et rediriger
   `/api` vers le backend Express, avec HTTPS (Let's Encrypt)

## 10. Aller plus loin

- Ajouter d'autres secteurs et leurs agents via l'interface Admin
  (Secteurs → Agents), le secteur JNANAT 1 est préchargé en démonstration
- Personnaliser le seuil de retard ou le nombre de jours d'absence
  consécutifs déclenchant une alerte dans `pointageController.js`
- Ajouter l'envoi d'e-mail/SMS pour les alertes (non inclus dans cette
  version)
