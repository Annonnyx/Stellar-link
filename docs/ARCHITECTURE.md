# Architecture Système — Nova Studio

## 1. Vue d'Ensemble

Nova Studio est une plateforme **monorepo** composée de trois services principaux qui communiquent entre eux :

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  (Navigateur Web / Discord)                                     │
└──────────┬──────────────────────────────┬───────────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│   APPLICATION WEB   │       │    BOT DISCORD      │
│   (Next.js 15)      │◄─────►│    (discord.js)     │
│                     │  API   │                     │
│  ┌───────────────┐  │ interne│  ┌───────────────┐  │
│  │  Frontend     │  │       │  │  Commands      │  │
│  │  (React 19)   │  │       │  │  Events        │  │
│  ├───────────────┤  │       │  │  Services      │  │
│  │  API Routes   │  │       │  └───────────────┘  │
│  │  tRPC Server  │  │       └─────────┬───────────┘
│  ├───────────────┤  │                 │
│  │  Socket.io    │  │                 │
│  │  Server       │  │                 │
│  └───────┬───────┘  │                 │
└──────────┼──────────┘                 │
           │                            │
           ▼                            ▼
┌─────────────────────────────────────────────────────┐
│                  COUCHE DONNÉES                      │
│                                                      │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  PostgreSQL   │  │  Redis   │  │ Cloudflare R2 │  │
│  │  (Prisma)     │  │ (cache/  │  │ (fichiers)    │  │
│  │              │  │  sessions)│  │               │  │
│  └──────────────┘  └──────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│               SERVICES EXTERNES                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Stripe  │  │  Resend  │  │  Discord API     │  │
│  │(paiement)│  │ (emails) │  │  (webhooks/bot)  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 2. Architecture Applicative

### 2.1 Monorepo (Turborepo + pnpm)

```
nova-studio/
├── apps/
│   ├── web/              # Next.js 15 — Application principale
│   └── discord-bot/      # Bot Discord — Service autonome
├── packages/
│   ├── shared/           # Types TS, constantes, validations (Zod)
│   ├── database/         # Client Prisma, schéma, migrations
│   └── email-templates/  # Templates email (React Email)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Pourquoi un monorepo ?**
- Types partagés entre le site et le bot (tickets, utilisateurs, etc.)
- Client Prisma unique pour les deux services
- Validations Zod réutilisables
- Déploiement coordonné

### 2.2 Application Web (Next.js 15)

```
apps/web/
├── app/
│   ├── (marketing)/          # Pages publiques (landing, services, etc.)
│   │   ├── page.tsx          # Page d'accueil
│   │   ├── services/
│   │   ├── about/
│   │   └── portfolio/
│   ├── (forms)/              # Formulaires publics
│   │   ├── join/             # Rejoindre l'agence
│   │   └── request/         # Demander un service
│   ├── (auth)/               # Pages d'authentification
│   │   ├── login/
│   │   └── verify/
│   ├── chat/                 # Chat via code de discussion
│   │   └── [code]/
│   ├── client/               # Espace client
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── invoices/
│   │   └── chat/
│   ├── admin/                # Dashboard admin
│   │   ├── dashboard/
│   │   ├── tickets/
│   │   ├── projects/
│   │   ├── creators/
│   │   ├── clients/
│   │   ├── invoices/
│   │   └── settings/
│   ├── creator/              # Espace créateur
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   └── profile/
│   └── api/
│       ├── trpc/             # tRPC handler
│       ├── webhooks/
│       │   ├── stripe/
│       │   └── discord/
│       ├── socket/           # Socket.io endpoint
│       └── cron/             # Jobs planifiés
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── forms/                # Composants de formulaire
│   ├── chat/                 # Composants de chat
│   ├── tickets/              # Composants de tickets
│   ├── dashboard/            # Composants dashboard
│   └── layout/               # Header, Footer, Sidebar
├── lib/
│   ├── auth.ts               # Configuration Auth.js
│   ├── stripe.ts             # Client Stripe
│   ├── resend.ts             # Client Resend
│   ├── socket.ts             # Client Socket.io
│   ├── r2.ts                 # Client Cloudflare R2
│   └── utils.ts              # Helpers
├── server/
│   ├── trpc/
│   │   ├── router.ts         # Root router
│   │   ├── context.ts        # Context tRPC
│   │   └── routers/
│   │       ├── ticket.ts
│   │       ├── chat.ts
│   │       ├── project.ts
│   │       ├── invoice.ts
│   │       ├── creator.ts
│   │       └── admin.ts
│   └── services/
│       ├── ticket.service.ts
│       ├── email.service.ts
│       ├── discord.service.ts
│       ├── pricing.service.ts
│       ├── invoice.service.ts
│       └── chat.service.ts
└── prisma/
    ├── schema.prisma
    ├── seed.ts
    └── migrations/
```

### 2.3 Bot Discord (discord.js v14)

```
apps/discord-bot/
├── src/
│   ├── index.ts              # Point d'entrée, initialisation client
│   ├── config.ts             # Configuration
│   ├── commands/
│   │   ├── ticket.ts         # /ticket — gestion manuelle
│   │   ├── assign.ts         # /assign — assigner un créateur
│   │   ├── status.ts         # /status — statut d'un projet
│   │   └── invoice.ts        # /invoice — facturation rapide
│   ├── events/
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   ├── messageCreate.ts
│   │   └── buttonInteraction.ts
│   ├── services/
│   │   ├── ticket.service.ts     # Création/gestion de tickets Discord
│   │   ├── notification.service.ts # Notifications aux créateurs
│   │   ├── sync.service.ts       # Synchronisation avec la BDD
│   │   └── api.service.ts        # Appels API vers le site
│   ├── embeds/
│   │   ├── ticket.embed.ts       # Embeds pour les tickets
│   │   ├── project.embed.ts      # Embeds pour les projets
│   │   └── notification.embed.ts # Embeds pour les notifications
│   └── utils/
│       ├── permissions.ts
│       └── formatters.ts
├── package.json
└── tsconfig.json
```

## 3. Communication Inter-Services

### 3.1 Web ↔ Discord Bot

La communication entre le site et le bot Discord se fait de deux manières :

#### A. Site → Bot : Via la base de données + événements

```
[Site Web]
    │
    ├── 1. Écrit le ticket en BDD (Prisma)
    │
    ├── 2. Appel API interne au bot
    │      POST /api/internal/discord/ticket
    │      (authentifié par clé API interne)
    │
    └── Le bot reçoit l'événement et crée
        le ticket Discord (channel/thread)
```

#### B. Bot → Site : Via la base de données + webhooks

```
[Bot Discord]
    │
    ├── 1. Met à jour la BDD (Prisma)
    │      (ex: créateur accepte une tâche)
    │
    ├── 2. Appel webhook vers le site
    │      POST /api/webhooks/discord
    │
    └── Le site met à jour le dashboard
        et notifie via Socket.io
```

### 3.2 Chat en Temps Réel (Socket.io)

```
┌──────────┐    WebSocket    ┌──────────────┐    BDD     ┌──────────┐
│  Client  │◄──────────────►│  Socket.io   │◄─────────►│ PostgreSQL│
│  (React) │                │  Server      │            │          │
└──────────┘                └──────┬───────┘            └──────────┘
                                   │
                                   │ Événements
                                   ▼
                            ┌──────────────┐
                            │  Bot Discord │
                            │  (relay msg) │
                            └──────────────┘
```

**Rooms Socket.io :**
- `ticket:{ticketId}` — Chat lié à un ticket
- `project:{projectId}` — Chat lié à un projet
- `admin:notifications` — Notifications admin en temps réel
- `creator:{creatorId}` — Notifications créateur

### 3.3 Flux de Vérification Email

```
[Formulaire soumis]
    │
    ├── 1. Création ticket (statut: PENDING_VERIFICATION)
    ├── 2. Génération code de vérification (6 chiffres)
    ├── 3. Envoi email via Resend
    │
    ▼
[Utilisateur clique le lien / entre le code]
    │
    ├── 4. Vérification du code
    ├── 5. Ticket passe en statut: VERIFIED
    ├── 6. Génération du "Code de Discussion" (ex: NS-A7K9X2)
    ├── 7. Création du channel/thread Discord
    ├── 8. Notification aux admins (site + Discord)
    │
    ▼
[Utilisateur accède au chat via son code]
```

## 4. Patterns Architecturaux

### 4.1 Couche Service (Business Logic)

Toute la logique métier est centralisée dans des **services** (`server/services/`), consommés par :
- Les routes tRPC (site web)
- Les handlers du bot Discord
- Les webhooks

```typescript
// Exemple : TicketService
class TicketService {
  async createJoinTicket(data: JoinFormData): Promise<Ticket>
  async createServiceTicket(data: ServiceFormData): Promise<Ticket>
  async verifyEmail(ticketId: string, code: string): Promise<DiscussionCode>
  async assignCreator(ticketId: string, creatorId: string): Promise<void>
  async updateStatus(ticketId: string, status: TicketStatus): Promise<void>
  async estimatePrice(params: PricingParams): Promise<PriceEstimate>
}
```

### 4.2 Event-Driven

Les actions clés déclenchent des événements propagés aux différents services :

```
TICKET_CREATED    → Discord (créer channel) + Email (vérification)
TICKET_VERIFIED   → Discord (notifier admins) + Site (activer chat)
TASK_ACCEPTED     → Discord (notifier) + Site (update dashboard) + Email (client)
PAYMENT_RECEIVED  → Discord (notifier) + Site (update) + Email (facture)
```

### 4.3 Sécurité

- **Auth.js** pour l'authentification admin/créateur (OAuth Discord + credentials)
- **Codes de discussion** pour l'accès client au chat (sans compte obligatoire)
- **Rate limiting** sur les formulaires et API publiques
- **Validation Zod** sur toutes les entrées (partagée via `packages/shared`)
- **RBAC** (Role-Based Access Control) : `ADMIN`, `CREATOR`, `CLIENT`
- **API interne** authentifiée par clé secrète partagée entre web et bot
- **CSRF protection** via Next.js built-in
- **Helmet** headers de sécurité

## 5. Scalabilité

| Composant | Stratégie de scaling |
|-----------|---------------------|
| **Next.js** | Vercel (auto-scaling serverless) |
| **Bot Discord** | VPS unique (suffisant pour un seul serveur Discord) |
| **Socket.io** | VPS avec Redis adapter si besoin de multi-instance |
| **PostgreSQL** | Managed DB (Supabase / Neon / Railway) |
| **Redis** | Managed Redis (Upstash) pour cache + sessions Socket.io |
| **Fichiers** | Cloudflare R2 (stockage S3-compatible, pas de frais egress) |
