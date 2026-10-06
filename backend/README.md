# Portfolio HSH — Backend Spring Boot

## 🏗️ Architecture complète

```
portfolio_hsh/
├── src/                        ← Frontend React + Vite + TypeScript
│   ├── components/
│   │   ├── Projects.tsx        ← Galerie projets (données live depuis API)
│   │   ├── ProjectModal.tsx    ← Modale présentation vidéo + galerie images
│   │   ├── About.tsx           ← Section À Propos (données dynamiques)
│   │   ├── Skills.tsx          ← Compétences (données dynamiques)
│   │   ├── Experience.tsx      ← Expériences (données dynamiques)
│   │   └── Contact.tsx         ← Contact + lien Admin Portal
│   ├── pages/
│   │   ├── Index.tsx           ← Page principale (enregistre les visites)
│   │   └── admin/
│   │       ├── AdminLogin.tsx  ← Page login admin JWT
│   │       └── AdminDashboard.tsx ← Dashboard complet (stats + CRUD)
│   └── lib/
│       └── api.ts              ← Client API TypeScript (REST calls + auth)
│
├── backend/                    ← Backend Spring Boot 3 / Java 21
│   ├── src/main/java/com/portfolio/backend/
│   │   ├── model/              ← Entités JPA (Project, Experience, Skill, Profile, VisitorStat, User)
│   │   ├── repository/         ← Repositories Spring Data JPA
│   │   ├── service/            ← Services métier (CRUD + analytics)
│   │   ├── controller/         ← REST Controllers (API endpoints)
│   │   ├── config/             ← Security, JWT, CORS, WebConfig (uploads statiques)
│   │   ├── dto/                ← DTOs (AuthRequest, AuthResponse, StatsSummaryDto...)
│   │   └── init/               ← DataInitializer (seed données au démarrage)
│   ├── src/main/resources/
│   │   └── application.yml     ← Configuration Spring Boot
│   ├── .env                    ← Variables d'environnement locales
│   ├── .env.example            ← Template de configuration
│   ├── docker-compose.yml      ← PostgreSQL via Docker (optionnel)
│   ├── setup-db.sh             ← Script création base de données
│   └── run-backend.sh          ← Script de démarrage du backend
│
└── vite.config.ts              ← Dev server port 5173 + proxy → backend :8080
```

---

## 🚀 Démarrage rapide

### Prérequis
- Java 21 + Maven 3.x
- PostgreSQL 16 (local ou Docker)
- Node.js 18+ + npm

---

### 1. Configuration de la base de données

#### Option A — PostgreSQL local (recommandée)

Créez la base `portfolio_db` en tant qu'admin PostgreSQL :

```bash
sudo -u postgres psql -c "CREATE DATABASE portfolio_db;"
# Si besoin, définissez un mot de passe pour l'utilisateur postgres :
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'votreMotDePasse';"
```

Puis éditez `backend/.env` :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USERNAME=postgres
DB_PASSWORD=votreMotDePasse
```

#### Option B — PostgreSQL via Docker

```bash
cd backend
docker compose up -d
# Mettez à jour backend/.env :
# DB_PASSWORD=postgrespassword
```

---

### 2. Démarrer le backend Spring Boot

```bash
cd backend
./run-backend.sh
```

Ou directement avec Maven :
```bash
cd backend
mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments="-DDB_PASSWORD=votreMotDePasse"
```

Le backend démarre sur **http://localhost:8080**

> **Premier démarrage :** Les tables sont créées automatiquement (Hibernate DDL auto=update), et les données initiales sont insérées :
> - Compte admin : `admin` / `admin123`
> - 5 projets portfolio avec images et vidéos de démonstration
> - 3 expériences professionnelles
> - 25 compétences techniques
> - Profil complet

---

### 3. Démarrer le frontend React

```bash
# À la racine du projet
npm run dev
```

Frontend disponible sur **http://localhost:5173**

> Le proxy Vite redirige automatiquement `/api/*` et `/uploads/*` vers `http://localhost:8080`.

---

## 🔐 Accès Admin

1. Ouvrez **http://localhost:5173/admin/login**
2. Connectez-vous avec : `admin` / `admin123`
3. Vous accédez au dashboard complet

### Fonctionnalités admin disponibles :
| Onglet | Actions |
|--------|---------|
| 📊 **Statistiques Visiteurs** | Visites totales, visiteurs uniques, graphique 30j, répartition appareils, dernières visites |
| 🗂️ **Projets & Médias** | Créer, modifier, supprimer des projets avec upload image de présentation + vidéo (MP4/WebM/YouTube/Vimeo) |
| ⚡ **Compétences** | Ajouter/supprimer compétences par catégorie |
| 💼 **Expériences** | CRUD expériences professionnelles/académiques |
| 👤 **Profil & À propos** | Modifier biographie, statut, langues, liens sociaux, focus |
| 🔒 **Sécurité** | Changer le mot de passe admin |

---

## 📡 Endpoints API

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| `POST` | `/api/auth/login` | Public | Connexion admin → JWT |
| `GET` | `/api/auth/me` | 🔒 JWT | Info utilisateur courant |
| `POST` | `/api/auth/change-password` | 🔒 JWT | Changer le mot de passe |
| `GET` | `/api/projects` | Public | Liste des projets |
| `GET` | `/api/projects/{id}` | Public | Détail d'un projet |
| `POST` | `/api/projects` | 🔒 JWT | Créer un projet |
| `PUT` | `/api/projects/{id}` | 🔒 JWT | Modifier un projet |
| `DELETE` | `/api/projects/{id}` | 🔒 JWT | Supprimer un projet |
| `POST` | `/api/projects/{id}/view` | Public | Enregistrer une vue projet |
| `GET` | `/api/skills` | Public | Liste des compétences |
| `POST` | `/api/skills` | 🔒 JWT | Ajouter une compétence |
| `DELETE` | `/api/skills/{id}` | 🔒 JWT | Supprimer une compétence |
| `GET` | `/api/experiences` | Public | Liste des expériences |
| `POST` | `/api/experiences` | 🔒 JWT | Ajouter une expérience |
| `PUT` | `/api/experiences/{id}` | 🔒 JWT | Modifier une expérience |
| `DELETE` | `/api/experiences/{id}` | 🔒 JWT | Supprimer une expérience |
| `GET` | `/api/profile` | Public | Profil public |
| `PUT` | `/api/profile` | 🔒 JWT | Modifier le profil |
| `POST` | `/api/stats/visit` | Public | Enregistrer une visite |
| `GET` | `/api/stats/summary` | 🔒 JWT | Résumé statistiques |
| `GET` | `/api/stats/recent` | 🔒 JWT | Dernières visites |
| `POST` | `/api/upload/image` | 🔒 JWT | Uploader une image de présentation |
| `POST` | `/api/upload/video` | 🔒 JWT | Uploader une vidéo de présentation |
| `GET` | `/uploads/**` | Public | Servir les médias uploadés |

---

## 🎬 Fonctionnement des présentations de projets

Lorsqu'un visiteur clique sur une carte projet :
1. Le compteur de vues est incrémenté (`POST /api/projects/{id}/view`)
2. Une **modale de présentation** s'ouvre avec :
   - **Onglet Vidéo** : Lecteur vidéo natif `<video>` pour MP4/WebM, ou `<iframe>` pour YouTube/Vimeo
   - **Onglet Images** : Image principale + galerie miniatures cliquables
   - Description détaillée, stack technologique, liens GitHub et démo live
   - Compteur de vues et métadonnées du projet

---

## 📈 Système de statistiques visiteurs

À chaque visite du portfolio :
- L'IP est **hashée en SHA-256** (protection vie privée RGPD)
- Le **User-Agent** est parsé pour extraire : navigateur, OS, type d'appareil
- La **page URL** et le **referrer** sont enregistrés

Le dashboard admin affiche :
- KPIs : total visites, visiteurs uniques, aujourd'hui, cette semaine, vues projets
- Graphique barres des visites des 30 derniers jours
- Camembert de répartition par appareil (Desktop/Mobile/Tablet)
- Classement popularité des projets avec barre de progression
- Tableau des 20 dernières visites avec tous les détails

---

## 🔧 Configuration avancée (`backend/.env`)

```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# Serveur
PORT=8080

# JWT (changez ce secret en production !)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Compte admin par défaut (créé au premier démarrage)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@portfolio.local
```
