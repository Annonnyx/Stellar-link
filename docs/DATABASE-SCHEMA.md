# Schéma de Base de Données — Nova Studio

## 1. Diagramme Relationnel

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    User      │────<│  UserSkill   │>────│     Skill        │
│              │     └──────────────┘     └──────────────────┘
│  id          │
│  email       │     ┌──────────────────┐
│  role        │────<│  CreatorProfile  │
│  ...         │     │  availability    │
└──────┬───────┘     │  hourlyRate      │
       │             │  portfolio       │
       │             └──────────────────┘
       │
       │  assignedTo
       ▼
┌──────────────────┐     ┌─────────────────┐
│  TicketAssignment│────>│     Ticket       │
└──────────────────┘     │                  │
                         │  id              │
                         │  code            │
                         │  type (JOIN/SVC) │
┌──────────────────┐     │  status          │
│  TicketFormData   │────>│  discussionCode  │
│  (JSON fields)   │     │  estimatedPrice  │
└──────────────────┘     └───────┬──────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
           ┌──────────┐  ┌───────────┐  ┌──────────┐
           │ Message  │  │  Project  │  │ Invoice  │
           │          │  │           │  │          │
           │ content  │  │ title     │  │ amount   │
           │ sender   │  │ status    │  │ status   │
           │ chatRoom │  │ progress  │  │ stripeId │
           └──────────┘  │ deadline  │  └──────────┘
                         └─────┬─────┘
                               │
                               ▼
                        ┌─────────────┐
                        │ Deliverable │
                        │             │
                        │ fileName    │
                        │ fileUrl     │
                        │ version     │
                        └─────────────┘
```

---

## 2. Schéma Prisma Complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// AUTHENTICATION & USERS
// ============================================================

enum Role {
  ADMIN
  CREATOR
  CLIENT
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  role          Role      @default(CLIENT)
  passwordHash  String?

  // Relations Auth.js
  accounts Account[]
  sessions Session[]

  // Relations métier
  creatorProfile   CreatorProfile?
  ticketAssignments TicketAssignment[]
  sentMessages     Message[]          @relation("MessageSender")
  notifications    Notification[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================================
// CREATOR PROFILE
// ============================================================

enum Availability {
  FULL_TIME
  PART_TIME
  OCCASIONAL
  WEEKEND
}

enum ExperienceLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

model CreatorProfile {
  id               String           @id @default(cuid())
  userId           String           @unique
  user             User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Identité
  displayName      String
  bio              String?          @db.Text
  avatarUrl        String?
  country          String?
  city             String?

  // Compétences
  skills           CreatorSkill[]
  softwareTools    String[]         // ["After Effects", "Blender", "React"]
  languages        Json             // [{ lang: "fr", level: "native" }, ...]
  experienceLevel  ExperienceLevel  @default(INTERMEDIATE)
  yearsExperience  Int              @default(0)

  // Portfolio
  portfolioUrls    String[]         // Liens externes
  cvUrl            String?          // Lien vers CV uploadé

  // Disponibilité
  availability     Availability     @default(OCCASIONAL)
  hoursPerWeek     Int              @default(10)
  hourlyRate       Decimal?         @db.Decimal(10, 2)

  // Statut
  isActive         Boolean          @default(true)
  isVerified       Boolean          @default(false)
  joinedAt         DateTime         @default(now())

  // Relations
  assignedTickets  TicketAssignment[]

  // Stats
  completedProjects Int             @default(0)
  averageRating     Decimal?        @db.Decimal(3, 2) // 0.00 - 5.00

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("creator_profiles")
}

// ============================================================
// SKILLS (Compétences / Services)
// ============================================================

enum ServiceCategory {
  VIDEO_EDITING     // Montage Vidéo
  THREE_D           // 3D
  DEVELOPMENT       // Développement
  SOUND_DESIGN      // Ingénierie Son / Sound Design
  GRAPHIC_DESIGN    // Graphisme
  TRANSLATION       // Traduction
  DISCORD_SERVER    // Création de Serveurs Discord
  OTHER             // Autre
}

model Skill {
  id          String          @id @default(cuid())
  name        String          @unique
  category    ServiceCategory
  description String?
  iconName    String?         // Nom de l'icône Lucide

  // Relations
  creators    CreatorSkill[]

  // Discord
  discordRoleId String?       // ID du rôle Discord correspondant

  createdAt DateTime @default(now())

  @@map("skills")
}

model CreatorSkill {
  id         String  @id @default(cuid())
  creatorId  String
  skillId    String

  creator    CreatorProfile @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  skill      Skill          @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@unique([creatorId, skillId])
  @@map("creator_skills")
}

// ============================================================
// TICKETS
// ============================================================

enum TicketType {
  JOIN      // Candidature pour rejoindre
  SERVICE   // Demande de service
  CONTACT   // Simple contact
}

enum TicketStatus {
  PENDING_VERIFICATION   // En attente de vérification email
  VERIFIED               // Email vérifié
  IN_REVIEW              // En cours d'examen
  ACCEPTED               // Accepté
  ASSIGNED               // Créateur(s) assigné(s)
  IN_PROGRESS            // Travail en cours
  PENDING_REVISION       // En attente de révision client
  PENDING_PAYMENT        // En attente de paiement
  COMPLETED              // Terminé
  REJECTED               // Refusé
  CANCELLED              // Annulé
}

model Ticket {
  id     String       @id @default(cuid())
  code   String       @unique  // NS-J-XXXXXX ou NS-S-XXXXXX
  type   TicketType
  status TicketStatus @default(PENDING_VERIFICATION)

  // Soumetteur (pas forcément un User enregistré)
  submitterName     String
  submitterEmail    String
  submitterDiscord  String?
  submitterPhone    String?
  submitterCountry  String?

  // Vérification email
  emailVerified       Boolean  @default(false)
  verificationCode    String?  // Code 6 chiffres (hashé)
  verificationExpires DateTime?
  verificationAttempts Int     @default(0)

  // Code de discussion (généré après vérification)
  discussionCode String? @unique // NS-J-XXXXXX (même que code pour simplicité)

  // Données du formulaire (JSON flexible)
  formData Json // Toutes les données du formulaire

  // Estimation de prix (SERVICE uniquement)
  estimatedPriceMin Decimal? @db.Decimal(10, 2)
  estimatedPriceMax Decimal? @db.Decimal(10, 2)
  finalPrice        Decimal? @db.Decimal(10, 2)
  pricingParams     Json?    // Paramètres utilisés pour l'estimation

  // Discord
  discordChannelId String?   // ID du channel ou thread Discord
  discordMessageId String?   // ID du message embed principal

  // Relations
  assignments TicketAssignment[]
  messages    Message[]
  project     Project?
  invoices    Invoice[]
  statusLogs  TicketStatusLog[]
  files       TicketFile[]

  // Métadonnées
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  closedAt  DateTime?

  @@index([type, status])
  @@index([submitterEmail])
  @@index([discussionCode])
  @@map("tickets")
}

model TicketStatusLog {
  id        String       @id @default(cuid())
  ticketId  String
  ticket    Ticket       @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  
  fromStatus TicketStatus?
  toStatus   TicketStatus
  changedBy  String?      // userId ou "system"
  note       String?

  createdAt DateTime @default(now())

  @@map("ticket_status_logs")
}

model TicketAssignment {
  id        String @id @default(cuid())
  ticketId  String
  userId    String
  creatorId String

  ticket    Ticket          @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  creator   CreatorProfile  @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  // Le créateur a-t-il accepté volontairement ou été assigné par un admin ?
  selfAssigned Boolean @default(false)
  assignedBy   String? // userId de l'admin qui a assigné

  createdAt DateTime @default(now())

  @@unique([ticketId, userId])
  @@map("ticket_assignments")
}

model TicketFile {
  id       String @id @default(cuid())
  ticketId String
  ticket   Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  fileName    String
  fileUrl     String
  fileSize    Int        // en bytes
  mimeType    String
  uploadedBy  String?    // userId ou "submitter"

  createdAt DateTime @default(now())

  @@map("ticket_files")
}

// ============================================================
// MESSAGES (Chat)
// ============================================================

enum MessageType {
  TEXT
  FILE
  SYSTEM    // Messages système (ex: "Créateur X a été assigné")
  IMAGE
}

model Message {
  id       String      @id @default(cuid())
  type     MessageType @default(TEXT)
  content  String      @db.Text
  
  // Lien avec ticket ou projet
  ticketId  String?
  ticket    Ticket?    @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  projectId String?
  project   Project?   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Expéditeur
  senderId     String?
  sender       User?      @relation("MessageSender", fields: [senderId], references: [id])
  senderName   String     // Nom affiché (pour les non-users)
  senderType   String     // "admin", "creator", "client", "system"
  
  // Fichier joint (si type = FILE ou IMAGE)
  fileUrl      String?
  fileName     String?
  fileSize     Int?
  
  // Discord sync
  discordMessageId String?  // ID du message Discord correspondant
  fromDiscord      Boolean  @default(false) // Message originaire de Discord

  // Statut
  isRead    Boolean  @default(false)
  readAt    DateTime?
  isEdited  Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ticketId, createdAt])
  @@index([projectId, createdAt])
  @@map("messages")
}

// ============================================================
// PROJECTS
// ============================================================

enum ProjectStatus {
  DRAFT
  PLANNING
  IN_PROGRESS
  IN_REVISION
  PENDING_APPROVAL
  COMPLETED
  CANCELLED
  ON_HOLD
}

model Project {
  id       String        @id @default(cuid())
  title    String
  status   ProjectStatus @default(DRAFT)

  // Lien avec le ticket d'origine
  ticketId String   @unique
  ticket   Ticket   @relation(fields: [ticketId], references: [id])

  // Détails
  description   String?   @db.Text
  deadline      DateTime?
  startDate     DateTime?
  completedDate DateTime?

  // Progression
  progress      Int       @default(0) // 0-100

  // Prix
  agreedPrice   Decimal?  @db.Decimal(10, 2)
  
  // Catégories de service
  categories    ServiceCategory[]

  // Relations
  deliverables  Deliverable[]
  messages      Message[]
  invoices      Invoice[]
  milestones    Milestone[]
  statusLogs    ProjectStatusLog[]

  // Discord
  discordChannelId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("projects")
}

model ProjectStatusLog {
  id         String        @id @default(cuid())
  projectId  String
  project    Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)

  fromStatus ProjectStatus?
  toStatus   ProjectStatus
  changedBy  String?
  note       String?

  createdAt DateTime @default(now())

  @@map("project_status_logs")
}

model Milestone {
  id        String  @id @default(cuid())
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  title       String
  description String?
  dueDate     DateTime?
  completed   Boolean   @default(false)
  completedAt DateTime?
  order       Int       @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("milestones")
}

model Deliverable {
  id        String  @id @default(cuid())
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  fileName    String
  fileUrl     String
  fileSize    Int        // en bytes
  mimeType    String
  version     Int        @default(1)
  description String?
  
  uploadedById String?
  
  // Validation client
  isApproved  Boolean @default(false)
  approvedAt  DateTime?
  feedback    String?  @db.Text

  createdAt DateTime @default(now())

  @@map("deliverables")
}

// ============================================================
// INVOICES (Factures)
// ============================================================

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
  REFUNDED
}

model Invoice {
  id       String        @id @default(cuid())
  number   String        @unique // NS-INV-0001
  status   InvoiceStatus @default(DRAFT)

  // Relations
  ticketId  String?
  ticket    Ticket?   @relation(fields: [ticketId], references: [id])
  projectId String?
  project   Project?  @relation(fields: [projectId], references: [id])

  // Client
  clientName    String
  clientEmail   String
  clientAddress String? @db.Text

  // Montants
  subtotal     Decimal  @db.Decimal(10, 2)
  taxRate      Decimal  @default(0) @db.Decimal(5, 2) // ex: 20.00 pour 20%
  taxAmount    Decimal  @db.Decimal(10, 2)
  totalAmount  Decimal  @db.Decimal(10, 2)
  currency     String   @default("EUR")

  // Lignes de facture
  items InvoiceItem[]

  // Stripe
  stripeInvoiceId  String? @unique
  stripePaymentUrl String?

  // Dates
  issuedAt   DateTime?
  dueAt      DateTime?
  paidAt     DateTime?

  // Notes
  notes      String? @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("invoices")
}

model InvoiceItem {
  id        String  @id @default(cuid())
  invoiceId String
  invoice   Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  description String
  quantity    Decimal @db.Decimal(10, 2)
  unitPrice   Decimal @db.Decimal(10, 2)
  totalPrice  Decimal @db.Decimal(10, 2)
  order       Int     @default(0)

  @@map("invoice_items")
}

// ============================================================
// NOTIFICATIONS
// ============================================================

enum NotificationType {
  TICKET_NEW
  TICKET_VERIFIED
  TICKET_STATUS_CHANGED
  MESSAGE_NEW
  TASK_AVAILABLE
  TASK_ASSIGNED
  PROJECT_UPDATED
  PAYMENT_RECEIVED
  INVOICE_SENT
  SYSTEM
}

model Notification {
  id     String           @id @default(cuid())
  userId String
  user   User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type   NotificationType
  
  title   String
  message String
  link    String?         // URL relative vers la ressource
  
  isRead  Boolean @default(false)
  readAt  DateTime?

  // Métadonnées
  metadata Json?          // Données supplémentaires (ticketId, projectId, etc.)

  createdAt DateTime @default(now())

  @@index([userId, isRead, createdAt])
  @@map("notifications")
}

// ============================================================
// SETTINGS
// ============================================================

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value Json

  updatedAt DateTime @updatedAt

  @@map("settings")
}

// ============================================================
// PRICING (Prix de base configurables)
// ============================================================

model PricingConfig {
  id       String          @id @default(cuid())
  category ServiceCategory @unique

  basePriceMin  Decimal @db.Decimal(10, 2) // Prix min par jour
  basePriceMax  Decimal @db.Decimal(10, 2) // Prix max par jour
  unit          String  @default("day")    // "day", "word", "fixed"

  // Multiplicateurs (JSON pour flexibilité)
  multipliers Json // { complexity: {...}, urgency: {...}, ... }

  isActive  Boolean @default(true)

  updatedAt DateTime @updatedAt

  @@map("pricing_configs")
}
```

---

## 3. Index et Performance

### Index principaux (déjà définis dans le schéma)

| Table | Index | Raison |
|-------|-------|--------|
| `tickets` | `(type, status)` | Filtrage dashboard admin |
| `tickets` | `(submitterEmail)` | Recherche par email |
| `tickets` | `(discussionCode)` | Accès chat par code |
| `messages` | `(ticketId, createdAt)` | Pagination messages chat |
| `messages` | `(projectId, createdAt)` | Pagination messages projet |
| `notifications` | `(userId, isRead, createdAt)` | Liste notifications non lues |

### Index additionnels recommandés

```sql
-- Recherche full-text sur les tickets
CREATE INDEX idx_tickets_fulltext ON tickets 
  USING gin(to_tsvector('french', submitter_name || ' ' || form_data::text));

-- Recherche full-text sur les messages  
CREATE INDEX idx_messages_fulltext ON messages 
  USING gin(to_tsvector('french', content));
```

---

## 4. Seed Data

Le seed initial doit contenir :

1. **Skills** : Les 7 catégories de service + sous-spécialités
2. **PricingConfig** : Prix de base pour chaque catégorie
3. **User Admin** : Au moins un compte admin
4. **Settings** : Configuration par défaut (Discord channels, etc.)

```typescript
// prisma/seed.ts - Structure

const skills = [
  { name: "Montage Vidéo", category: "VIDEO_EDITING", discordRoleId: "..." },
  { name: "Modélisation 3D", category: "THREE_D", discordRoleId: "..." },
  { name: "Animation 3D", category: "THREE_D", discordRoleId: "..." },
  { name: "Développement Web", category: "DEVELOPMENT", discordRoleId: "..." },
  { name: "Développement Mobile", category: "DEVELOPMENT", discordRoleId: "..." },
  { name: "Développement Bot", category: "DEVELOPMENT", discordRoleId: "..." },
  { name: "Sound Design", category: "SOUND_DESIGN", discordRoleId: "..." },
  { name: "Composition Musicale", category: "SOUND_DESIGN", discordRoleId: "..." },
  { name: "Mixage / Mastering", category: "SOUND_DESIGN", discordRoleId: "..." },
  { name: "Graphisme / Illustration", category: "GRAPHIC_DESIGN", discordRoleId: "..." },
  { name: "UI/UX Design", category: "GRAPHIC_DESIGN", discordRoleId: "..." },
  { name: "Motion Design", category: "GRAPHIC_DESIGN", discordRoleId: "..." },
  { name: "Traduction", category: "TRANSLATION", discordRoleId: "..." },
  { name: "Création Serveur Discord", category: "DISCORD_SERVER", discordRoleId: "..." },
];

const pricingConfigs = [
  { category: "VIDEO_EDITING", basePriceMin: 50, basePriceMax: 200, unit: "day" },
  { category: "THREE_D", basePriceMin: 80, basePriceMax: 300, unit: "day" },
  { category: "DEVELOPMENT", basePriceMin: 100, basePriceMax: 350, unit: "day" },
  { category: "SOUND_DESIGN", basePriceMin: 60, basePriceMax: 250, unit: "day" },
  { category: "GRAPHIC_DESIGN", basePriceMin: 50, basePriceMax: 200, unit: "day" },
  { category: "TRANSLATION", basePriceMin: 0.08, basePriceMax: 0.15, unit: "word" },
  { category: "DISCORD_SERVER", basePriceMin: 100, basePriceMax: 500, unit: "fixed" },
];
```
