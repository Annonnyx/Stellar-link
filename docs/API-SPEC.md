# Spécification API — Nova Studio

## 1. Architecture API

L'API est construite avec **tRPC** pour les appels type-safe depuis le frontend, et des **API Routes Next.js classiques** pour les webhooks et endpoints externes.

```
/api
├── /trpc/[trpc]         → Handler tRPC (toutes les procédures)
├── /webhooks
│   ├── /stripe          → Webhooks Stripe
│   └── /discord         → Webhooks Discord → Site
├── /internal
│   └── /discord         → API interne Bot → Site (clé API)
├── /verify-email        → Vérification email publique
├── /chat/[code]         → Accès chat par code de discussion
└── /cron
    ├── /cleanup         → Nettoyage tickets expirés
    └── /reminders       → Rappels automatiques
```

---

## 2. Routers tRPC

### 2.1 Structure

```typescript
// server/trpc/router.ts
export const appRouter = createRouter({
  ticket: ticketRouter,
  chat: chatRouter,
  project: projectRouter,
  invoice: invoiceRouter,
  creator: creatorRouter,
  admin: adminRouter,
  notification: notificationRouter,
  pricing: pricingRouter,
  upload: uploadRouter,
  public: publicRouter,
});
```

### 2.2 Public Router (Non authentifié)

Endpoints accessibles sans authentification.

```typescript
publicRouter = {
  // ---- FORMULAIRES ----
  
  // Soumettre le formulaire "Rejoindre l'agence"
  submitJoinForm: procedure
    .input(joinFormSchema)        // Validation Zod complète
    .mutation()
    // → Crée un ticket JOIN
    // → Envoie email de vérification
    // → Retourne { ticketId, message }

  // Soumettre le formulaire "Demander un service"
  submitServiceForm: procedure
    .input(serviceFormSchema)
    .mutation()
    // → Crée un ticket SERVICE
    // → Envoie email de vérification
    // → Retourne { ticketId, message }

  // Soumettre le formulaire de contact
  submitContactForm: procedure
    .input(contactFormSchema)
    .mutation()

  // ---- VÉRIFICATION EMAIL ----

  // Vérifier le code email
  verifyEmail: procedure
    .input(z.object({
      ticketId: z.string(),
      code: z.string().length(6),
    }))
    .mutation()
    // → Vérifie le code
    // → Génère le code de discussion
    // → Crée le channel Discord
    // → Retourne { discussionCode }

  // Renvoyer le code de vérification
  resendVerification: procedure
    .input(z.object({ ticketId: z.string() }))
    .mutation()
    // → Rate limited (max 3/heure)

  // ---- ESTIMATION ----

  // Calculer une estimation de prix en temps réel
  estimatePrice: procedure
    .input(pricingParamsSchema)
    .query()
    // → Retourne { min, max, breakdown }

  // ---- CHAT PAR CODE ----

  // Accéder au chat avec un code de discussion
  accessChat: procedure
    .input(z.object({ discussionCode: z.string() }))
    .query()
    // → Retourne { ticket, messages, participants }

  // Envoyer un message via code de discussion
  sendMessageByCode: procedure
    .input(z.object({
      discussionCode: z.string(),
      content: z.string(),
      type: z.enum(['TEXT', 'FILE', 'IMAGE']).default('TEXT'),
      fileUrl: z.string().optional(),
    }))
    .mutation()

  // ---- SITE VITRINE ----

  // Récupérer les services
  getServices: procedure.query()

  // Récupérer le portfolio
  getPortfolio: procedure
    .input(z.object({
      category: z.nativeEnum(ServiceCategory).optional(),
      cursor: z.string().optional(),
      limit: z.number().default(12),
    }))
    .query()

  // Récupérer les témoignages
  getTestimonials: procedure.query()
}
```

### 2.3 Ticket Router (Authentifié Admin/Créateur)

```typescript
ticketRouter = {
  // Lister les tickets (avec filtres et pagination)
  list: adminProcedure
    .input(z.object({
      type: z.nativeEnum(TicketType).optional(),
      status: z.nativeEnum(TicketStatus).optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      perPage: z.number().default(20),
      sortBy: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query()
    // → Retourne { tickets, total, pages }

  // Récupérer un ticket par ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query()

  // Mettre à jour le statut d'un ticket
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.nativeEnum(TicketStatus),
      note: z.string().optional(),
    }))
    .mutation()
    // → Met à jour le statut
    // → Crée un TicketStatusLog
    // → Notifie via Discord + Email si nécessaire

  // Assigner un créateur à un ticket
  assignCreator: adminProcedure
    .input(z.object({
      ticketId: z.string(),
      creatorUserId: z.string(),
    }))
    .mutation()
    // → Crée un TicketAssignment
    // → Notifie le créateur (site + Discord + email)
    // → Met à jour le statut si nécessaire

  // Retirer un créateur d'un ticket
  unassignCreator: adminProcedure
    .input(z.object({
      ticketId: z.string(),
      creatorUserId: z.string(),
    }))
    .mutation()

  // Définir le prix final
  setFinalPrice: adminProcedure
    .input(z.object({
      ticketId: z.string(),
      price: z.number().positive(),
    }))
    .mutation()

  // Créer un projet à partir d'un ticket
  createProjectFromTicket: adminProcedure
    .input(z.object({
      ticketId: z.string(),
      title: z.string(),
      deadline: z.date().optional(),
    }))
    .mutation()

  // Supprimer / archiver un ticket
  archive: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation()

  // ---- CRÉATEUR ----

  // Tickets disponibles pour un créateur (basé sur ses compétences)
  availableForMe: creatorProcedure.query()

  // Accepter une tâche
  acceptTask: creatorProcedure
    .input(z.object({ ticketId: z.string() }))
    .mutation()
    // → Crée un TicketAssignment (selfAssigned: true)
    // → Notifie les admins
    // → Met à jour le Discord
}
```

### 2.4 Chat Router

```typescript
chatRouter = {
  // Récupérer les messages d'un ticket/projet
  getMessages: protectedProcedure
    .input(z.object({
      ticketId: z.string().optional(),
      projectId: z.string().optional(),
      cursor: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query()
    // → Retourne { messages, nextCursor }

  // Envoyer un message (authentifié)
  sendMessage: protectedProcedure
    .input(z.object({
      ticketId: z.string().optional(),
      projectId: z.string().optional(),
      content: z.string().min(1),
      type: z.enum(['TEXT', 'FILE', 'IMAGE']).default('TEXT'),
      fileUrl: z.string().optional(),
      fileName: z.string().optional(),
    }))
    .mutation()
    // → Crée le message en BDD
    // → Émet via Socket.io
    // → Sync avec Discord
    // → Notifie les participants offline

  // Marquer les messages comme lus
  markAsRead: protectedProcedure
    .input(z.object({
      ticketId: z.string().optional(),
      projectId: z.string().optional(),
    }))
    .mutation()

  // Compter les messages non lus
  unreadCount: protectedProcedure.query()
}
```

### 2.5 Project Router

```typescript
projectRouter = {
  // Lister les projets
  list: protectedProcedure
    .input(z.object({
      status: z.nativeEnum(ProjectStatus).optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      perPage: z.number().default(20),
    }))
    .query()

  // Récupérer un projet par ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query()

  // Mettre à jour un projet
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      status: z.nativeEnum(ProjectStatus).optional(),
      progress: z.number().min(0).max(100).optional(),
      deadline: z.date().optional(),
      description: z.string().optional(),
    }))
    .mutation()

  // Ajouter un livrable
  addDeliverable: creatorProcedure
    .input(z.object({
      projectId: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
      description: z.string().optional(),
    }))
    .mutation()

  // Approuver un livrable (admin)
  approveDeliverable: adminProcedure
    .input(z.object({
      deliverableId: z.string(),
      feedback: z.string().optional(),
    }))
    .mutation()

  // Gestion des milestones
  addMilestone: adminProcedure
    .input(milestoneSchema)
    .mutation()

  completeMilestone: protectedProcedure
    .input(z.object({ milestoneId: z.string() }))
    .mutation()

  // Stats projet (pour dashboard)
  stats: adminProcedure.query()
}
```

### 2.6 Invoice Router

```typescript
invoiceRouter = {
  // Lister les factures
  list: adminProcedure
    .input(z.object({
      status: z.nativeEnum(InvoiceStatus).optional(),
      page: z.number().default(1),
    }))
    .query()

  // Créer une facture
  create: adminProcedure
    .input(z.object({
      ticketId: z.string().optional(),
      projectId: z.string().optional(),
      clientName: z.string(),
      clientEmail: z.string().email(),
      clientAddress: z.string().optional(),
      items: z.array(invoiceItemSchema),
      taxRate: z.number().default(0),
      dueAt: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation()
    // → Crée la facture en BDD
    // → Crée la Stripe Invoice
    // → Retourne { invoice, stripePaymentUrl }

  // Envoyer une facture au client
  send: adminProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation()
    // → Envoie via Stripe + email Resend
    // → Met à jour le statut en SENT

  // Annuler une facture
  cancel: adminProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation()

  // Obtenir le lien de paiement (pour le client)
  getPaymentLink: procedure
    .input(z.object({ invoiceId: z.string() }))
    .query()
}
```

### 2.7 Creator Router

```typescript
creatorRouter = {
  // Profil du créateur connecté
  myProfile: creatorProcedure.query()

  // Mettre à jour son profil
  updateProfile: creatorProcedure
    .input(creatorProfileSchema)
    .mutation()

  // Mes tâches assignées
  myTasks: creatorProcedure
    .input(z.object({
      status: z.nativeEnum(TicketStatus).optional(),
    }))
    .query()

  // ---- ADMIN ----

  // Lister tous les créateurs
  listAll: adminProcedure
    .input(z.object({
      skill: z.string().optional(),
      availability: z.nativeEnum(Availability).optional(),
      isActive: z.boolean().optional(),
      search: z.string().optional(),
    }))
    .query()

  // Récupérer un créateur par ID
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query()

  // Activer / Désactiver un créateur
  toggleActive: adminProcedure
    .input(z.object({
      creatorId: z.string(),
      isActive: z.boolean(),
    }))
    .mutation()
}
```

### 2.8 Admin Router

```typescript
adminRouter = {
  // Dashboard stats
  dashboardStats: adminProcedure.query()
  // → { openTickets, activeProjects, monthlyRevenue, activeCreators,
  //     recentTickets, unreadMessages, urgentTasks }

  // Revenue chart data
  revenueChart: adminProcedure
    .input(z.object({
      period: z.enum(['week', 'month', 'quarter', 'year']),
    }))
    .query()

  // Tickets par catégorie (chart)
  ticketsByCategory: adminProcedure.query()

  // Activité récente
  recentActivity: adminProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query()

  // Paramètres
  getSettings: adminProcedure.query()
  updateSettings: adminProcedure
    .input(settingsSchema)
    .mutation()

  // Gestion des prix
  getPricingConfigs: adminProcedure.query()
  updatePricingConfig: adminProcedure
    .input(pricingConfigSchema)
    .mutation()
}
```

### 2.9 Notification Router

```typescript
notificationRouter = {
  // Mes notifications
  list: protectedProcedure
    .input(z.object({
      unreadOnly: z.boolean().default(false),
      cursor: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query()

  // Marquer comme lu
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation()

  // Marquer tout comme lu
  markAllAsRead: protectedProcedure.mutation()

  // Compter les non lues
  unreadCount: protectedProcedure.query()
}
```

---

## 3. API Routes Classiques (Non-tRPC)

### 3.1 Webhooks Stripe

```
POST /api/webhooks/stripe
```

Événements gérés :
- `invoice.paid` → Met à jour le statut de la facture
- `invoice.payment_failed` → Notifie les admins
- `checkout.session.completed` → Confirme le paiement

### 3.2 Webhooks Discord (Bot → Site)

```
POST /api/webhooks/discord
Headers: { "x-api-key": INTERNAL_API_KEY }
```

Événements :
- `ticket.message` → Nouveau message depuis Discord → sync chat site
- `ticket.accepted` → Créateur accepte une tâche depuis Discord
- `ticket.status_changed` → Changement de statut depuis Discord

### 3.3 API Interne (Site → Bot)

```
POST /api/internal/discord/ticket
Headers: { "x-api-key": INTERNAL_API_KEY }
Body: { ticketId, type, action }
```

Actions :
- `create` → Créer un channel/thread Discord pour le ticket
- `update` → Mettre à jour l'embed du ticket
- `notify` → Envoyer une notification
- `message` → Relayer un message du chat vers Discord
- `close` → Fermer/archiver le channel Discord

### 3.4 Upload de Fichiers

```
POST /api/upload
Content-Type: multipart/form-data
Auth: Bearer token OU discussionCode
```

→ Upload vers Cloudflare R2
→ Retourne `{ url, fileName, fileSize, mimeType }`

### 3.5 Cron Jobs

```
GET /api/cron/cleanup    (Vercel Cron - quotidien)
GET /api/cron/reminders  (Vercel Cron - quotidien)
```

- **Cleanup** : Supprime les tickets non vérifiés > 24h
- **Reminders** : Envoie des rappels pour les tickets sans réponse > 48h

---

## 4. Événements Socket.io

### 4.1 Événements Client → Serveur

| Événement | Payload | Description |
|-----------|---------|-------------|
| `join:room` | `{ roomId }` | Rejoindre un room de chat |
| `leave:room` | `{ roomId }` | Quitter un room |
| `message:send` | `{ roomId, content, type }` | Envoyer un message |
| `message:typing` | `{ roomId, isTyping }` | Indicateur de frappe |
| `message:read` | `{ roomId, messageId }` | Marquer comme lu |

### 4.2 Événements Serveur → Client

| Événement | Payload | Description |
|-----------|---------|-------------|
| `message:new` | `{ message }` | Nouveau message reçu |
| `message:typing` | `{ roomId, userName, isTyping }` | Quelqu'un tape |
| `message:read` | `{ roomId, readBy, readAt }` | Message lu |
| `ticket:updated` | `{ ticket }` | Ticket mis à jour |
| `notification:new` | `{ notification }` | Nouvelle notification |
| `project:updated` | `{ project }` | Projet mis à jour |

### 4.3 Rooms

- `ticket:{ticketId}` — Chat d'un ticket
- `project:{projectId}` — Chat d'un projet
- `admin:dashboard` — Notifications admin temps réel
- `creator:{userId}` — Notifications créateur
- `user:{userId}` — Notifications utilisateur générique

---

## 5. Schémas de Validation (Zod)

### 5.1 Formulaire "Rejoindre"

```typescript
const joinFormSchema = z.object({
  // Étape 1
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  displayName: z.string().max(50).optional(),
  dateOfBirth: z.date().refine(d => age(d) >= 16, "Vous devez avoir 16 ans minimum"),
  country: z.string().min(2),
  city: z.string().optional(),

  // Étape 2
  skills: z.array(z.nativeEnum(ServiceCategory)).min(1),
  subSpecialties: z.array(z.string()).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  yearsExperience: z.number().min(0).max(50),
  portfolioUrls: z.array(z.string().url()).min(1),
  softwareTools: z.array(z.string()).optional(),
  languages: z.array(z.object({
    language: z.string(),
    level: z.enum(['native', 'fluent', 'intermediate', 'basic']),
  })).min(1),

  // Étape 3
  motivation: z.string().min(100).max(2000),
  availability: z.nativeEnum(Availability),
  hoursPerWeek: z.number().min(5).max(40),
  hourlyRate: z.number().positive().optional(),
  hasFreelanceExperience: z.boolean(),
  hasAgencyExperience: z.boolean(),
  howDidYouFindUs: z.string(),

  // Étape 4
  email: z.string().email(),
  discord: z.string().min(2),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  acceptTerms: z.literal(true),
  acceptPrivacy: z.literal(true),
});
```

### 5.2 Formulaire "Demander un Service"

```typescript
const serviceFormSchema = z.object({
  // Étape 1
  clientName: z.string().min(2),
  email: z.string().email(),
  discord: z.string().optional(),
  phone: z.string().optional(),
  country: z.string(),

  // Étape 2
  serviceTypes: z.array(z.nativeEnum(ServiceCategory)).min(1),
  projectTitle: z.string().min(3).max(100),
  description: z.string().min(50).max(5000),
  referenceUrls: z.array(z.string().url()).optional(),
  deadline: z.date().optional(),

  // Étape 3
  volume: z.enum(['small', 'medium', 'large', 'very_large']),
  complexity: z.enum(['simple', 'medium', 'complex', 'very_complex']),
  urgency: z.enum(['standard', 'fast', 'urgent', 'express']),
  isModification: z.boolean(), // true = modif existant, false = from scratch
  revisionsCount: z.enum(['1', '2', '3', 'unlimited']),
  isCommercial: z.boolean(),
  exclusiveRights: z.boolean(),

  // Étape 4
  maxBudget: z.number().positive().optional(),
  additionalComments: z.string().optional(),
  acceptTerms: z.literal(true),
  acceptEstimate: z.literal(true),
});
```

---

## 6. Authentification & Autorisation

### 6.1 Niveaux d'Accès

| Niveau | Description | Accès |
|--------|-------------|-------|
| **Public** | Tout le monde | Site vitrine, formulaires, estimation prix |
| **Code** | Via code de discussion | Chat lié à un ticket spécifique |
| **Creator** | Compte créateur | Tâches, profil, chat projets |
| **Admin** | Compte admin | Tout |

### 6.2 Middleware tRPC

```typescript
// Procédure publique (pas d'auth)
const publicProcedure = t.procedure;

// Procédure authentifiée (tout rôle)
const protectedProcedure = t.procedure.use(isAuthenticated);

// Procédure admin uniquement
const adminProcedure = t.procedure.use(isAuthenticated).use(isAdmin);

// Procédure créateur uniquement
const creatorProcedure = t.procedure.use(isAuthenticated).use(isCreator);
```

### 6.3 Rate Limiting

| Endpoint | Limite |
|----------|--------|
| Soumission formulaire | 3/heure par IP |
| Renvoi code vérification | 3/heure par email |
| Vérification code | 5 tentatives par ticket |
| Envoi message (par code) | 30/minute |
| Upload fichier | 10/minute |
| Estimation prix | 30/minute |
