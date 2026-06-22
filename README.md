#Stellar Link  — Plateforme Agence Créative

> Plateforme web complète pour **Stellar Link**, une agence de création mettant en relation des créateurs freelances avec des clients, en gérant le copywriting, les contrats, la facturation et le suivi de projet.

---

## 🎯 Vision

Nova Studio recrute des créateurs de tous horizons (développeurs, animateurs, graphistes, sound designers, musiciens, traducteurs, monteurs vidéo, artistes 3D…) et les met en lien avec des clients. L'agence gère l'ensemble du processus : contrats, copyright, facturation et suivi de projet.

## 🏗️ Modules Principaux

| Module | Description |
|--------|-------------|
| **Site Vitrine** | Présentation premium de l'agence, services, portfolio |
| **Rejoindre l'Agence** | Formulaire complet de candidature → ticket Discord + ticket site |
| **Demander un Service** | Formulaire avec estimation de prix → ticket Discord (ping créateurs) + ticket site |
| **Système de Tickets** | Gestion complète des tickets (candidatures & demandes) côté site et Discord |
| **Chat en Temps Réel** | Discussion via "code de discussion" entre clients/recrues et admins/créateurs |
| **Vérification Email** | Envoi d'email de vérification avant accès au chat |
| **Dashboard Admin** | Gestion tickets, assignation créateurs, suivi projets, facturation |
| **Espace Client** | Suivi de projet, chat, factures |
| **Discord Bot** | Synchronisation tickets, notifications, assignation de tâches |
| **Paiements & Factures** | Gestion des paiements via Stripe, génération de factures |

## 📚 Documentation Technique

| Document | Contenu |
|----------|---------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture système globale et diagrammes |
| [`docs/TECH-STACK.md`](docs/TECH-STACK.md) | Stack technologique et justifications |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Spécifications fonctionnelles détaillées |
| [`docs/DATABASE-SCHEMA.md`](docs/DATABASE-SCHEMA.md) | Schéma de base de données complet |
| [`docs/API-SPEC.md`](docs/API-SPEC.md) | Spécification des endpoints API |
| [`docs/DISCORD-BOT.md`](docs/DISCORD-BOT.md) | Architecture et commandes du bot Discord |
| [`docs/UI-UX.md`](docs/UI-UX.md) | Pages, design system et guidelines UI/UX |
| [`docs/WORKFLOWS.md`](docs/WORKFLOWS.md) | Flux utilisateurs et logique métier |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Infrastructure, déploiement et CI/CD |

## 🚀 Stack Technique (Résumé)

- **Frontend** : Next.js 15 (App Router), React 19, TailwindCSS 3, shadcn/ui, Framer Motion, Recharts
- **Backend** : Next.js API Routes, tRPC v11, Socket.io v4
- **Base de données** : PostgreSQL + Prisma ORM v6
- **Temps réel** : Socket.io (server + client)
- **Auth** : Auth.js (NextAuth v5) avec Google & Discord OAuth
- **Email** : Resend + @nova-studio/email-templates
- **Paiements** : Stripe (Checkout + Webhooks)
- **Discord Bot** : discord.js v14 + Express HTTP server
- **Stockage fichiers** : Mock (prêt pour S3/R2)
- **Déploiement** : Vercel (site) + VPS (bot Discord + Socket.io)

## 📂 Structure du Projet

```
nova-studio/
├── apps/
│   ├── web/                  # Application Next.js principale
│   │   ├── app/              # App Router (pages, layouts, API routes)
│   │   ├── components/       # Composants React
│   │   ├── lib/              # Utilitaires, configs, helpers
│   │   ├── server/           # tRPC routers, services métier
│   │   └── prisma/           # Schéma Prisma & migrations
│   └── discord-bot/          # Bot Discord (discord.js)
│       ├── src/
│       │   ├── commands/     # Commandes slash
│       │   ├── events/       # Event handlers
│       │   ├── services/     # Services (tickets, notifications)
│       │   └── utils/        # Utilitaires
│       └── package.json
├── packages/
│   ├── shared/               # Types, constantes, validations partagés
│   ├── database/             # Client Prisma partagé
│   └── email-templates/      # Templates email (React Email)
├── docs/                     # Documentation technique
├── turbo.json                # Configuration Turborepo
├── package.json              # Workspace root
└── README.md
```

## 🔑 Variables d'Environnement Requises

```env
# Base de données
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# Discord Bot
DISCORD_BOT_TOKEN=...
DISCORD_GUILD_ID=...
DISCORD_WEBHOOK_URL=...
INTERNAL_API_KEY=...
BOT_HTTP_URL=http://localhost:4000

# Email
RESEND_API_KEY=...
EMAIL_FROM=Nova Studio <noreply@novastudio.com>

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Stockage
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ENDPOINT=...

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
SOCKET_SERVER_URL=...

# Cron
CRON_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ Fonctionnalités Implémentées

- **60+ routes** compilées et fonctionnelles
- **Site vitrine** : Home, Services, Portfolio, À propos, Contact, Créateurs (liste + profil), Espace Client
- **Formulaires** : Rejoindre l'agence (4 étapes), Demander un service (avec estimation en temps réel), Vérification email, Réinitialisation mot de passe (avec token + email Resend)
- **Espace client** : Lookup par code, affichage projet associé + factures avec statut
- **Espace Créateur** : Dashboard (stats, disponibilité), Tâches disponibles (acceptation), Projets assignés (progression), Revenus (factures + totaux), Profil (édition)
- **Chat temps réel** : Socket.io server + client, code de discussion, notifications typing
- **Dashboard admin** : Stats avec graphiques (statuts tickets + revenus mensuels Recharts), tickets (pagination + recherche + filtre + export CSV), créateurs (recherche + filtre), clients (liste + dépenses), projets (recherche + filtre + détail avec milestones), factures (actions de statut + export CSV), paramètres (formulaire avec sauvegarde)
- **Actions admin** : Changement de statut, création de projet/facture, assignation créateurs (ticket detail), marquer facture envoyée/payée, export CSV tickets/factures
- **Upload fichiers** : S3/R2 (AWS SDK) avec fallback mock, validation type MIME + taille, persistance en base, composant FileUpload réutilisable
- **tRPC** : Routers complets (ticket, creator, project, invoice, admin, notification) avec middleware auth (protected, admin, creator)
- **Notifications in-app** : Dropdown bell avec compte unread, marquer lu individuel/tout, API REST + tRPC
- **Pagination** : Tables admin (tickets, invoices, projects, creators) avec navigation prev/next
- **Cron jobs** : Cleanup tickets non-vérifiés (>24h), rappels factures
- **SEO** : Sitemap.xml, robots.txt, metadata OpenGraph + Twitter image
- **Sécurité** : Rate limiting (API routes sensibles + upload), headers de sécurité (HSTS, Permissions-Policy, X-Frame-Options), middleware avec protection admin
- **Intégrations** : Stripe Checkout + Webhooks (paiement réussi/échoué, mise à jour BDD), Resend emails avec templates, Discord bot notifications, Google/Discord OAuth
- **UX** : Loading skeletons, error boundaries (global + dashboard), toast notifications, 404 page

## 📋 Lancement du Développement

```bash
# Installation
pnpm install

# Base de données
pnpm db:push
pnpm db:seed

# Développement (tous les services)
pnpm dev

# Développement (web uniquement)
pnpm dev --filter=web

# Développement (bot uniquement)
pnpm dev --filter=discord-bot
```
# Stellar-link
