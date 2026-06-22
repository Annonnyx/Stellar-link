# Bot Discord — Nova Studio

## 1. Vue d'Ensemble

Le bot Discord de Nova Studio est le pont entre la plateforme web et le serveur Discord de l'agence. Il gère :

- La création automatique de tickets (channels/threads)
- Les notifications aux créateurs et admins
- L'assignation de tâches
- La synchronisation bidirectionnelle du chat
- Les commandes de gestion rapide

---

## 2. Structure du Serveur Discord

### 2.1 Catégories et Salons

```
📁 NOVA STUDIO
├── 📢 annonces
├── 💬 général
├── 📋 règlement
└── 🔗 liens-utiles

📁 CANDIDATURES (visible: @Admin uniquement)
├── 📥 nouvelles-candidatures       ← Tickets JOIN arrivent ici
└── 📁 [threads par candidature]    ← Threads auto-créés

📁 DEMANDES PROJETS (visible: @Admin + @Créateurs)
├── 📥 nouvelles-demandes           ← Tickets SERVICE arrivent ici
└── 📁 [threads par demande]        ← Threads auto-créés

📁 PROJETS EN COURS (visible: @Admin + créateurs assignés)
├── 📁 [channel par projet actif]   ← Créés quand un projet démarre
└── ...

📁 ADMINISTRATION (visible: @Admin)
├── 🤖 bot-logs
├── 📊 statistiques
└── ⚙️ configuration
```

### 2.2 Rôles Discord

| Rôle | Couleur | Permissions |
|------|---------|-------------|
| `@Admin` | 🔴 Rouge | Accès total, gestion tickets |
| `@Créateur` | 🟢 Vert | Voir les demandes, accepter des tâches |
| `@Monteur` | 🔵 | Ping pour demandes montage vidéo |
| `@3D` | 🟡 | Ping pour demandes 3D |
| `@Développeur` | 🟣 | Ping pour demandes dev |
| `@Sound Designer` | 🟠 | Ping pour demandes son |
| `@Graphiste` | 🩵 | Ping pour demandes graphisme |
| `@Traducteur` | ⚪ | Ping pour demandes traduction |
| `@Discord Builder` | 🟤 | Ping pour demandes serveur Discord |

---

## 3. Fonctionnalités du Bot

### 3.1 Création Automatique de Tickets

#### Ticket JOIN (Candidature)

Quand un formulaire "Rejoindre" est vérifié (email OK) :

1. Le bot crée un **thread** dans `#nouvelles-candidatures`
2. Le thread est nommé : `🟡 [Prénom Nom] — Candidature`
3. Un **embed riche** est posté avec :

```
╔══════════════════════════════════════╗
║  📋 NOUVELLE CANDIDATURE            ║
║  Code: NS-J-A7K9X2                  ║
╠══════════════════════════════════════╣
║                                      ║
║  👤 Identité                         ║
║  Nom: Jean Dupont                    ║
║  Pseudo: JDCreative                  ║
║  Pays: France                        ║
║  Âge: 24 ans                         ║
║                                      ║
║  🎨 Compétences                      ║
║  • Montage Vidéo (Expert)            ║
║  • Motion Design (Avancé)            ║
║  Logiciels: After Effects, Premiere  ║
║  Expérience: 5 ans                   ║
║                                      ║
║  📂 Portfolio                        ║
║  • https://behance.net/jdcreative    ║
║  • https://youtube.com/@jd           ║
║                                      ║
║  💬 Motivation                       ║
║  "Je souhaite rejoindre Nova Studio  ║
║  car..."                             ║
║                                      ║
║  ⏰ Disponibilité                    ║
║  Mi-temps — 20h/semaine              ║
║  Tarif souhaité: 35€/h               ║
║                                      ║
║  📧 Contact                          ║
║  Email: jean@example.com ✅ Vérifié  ║
║  Discord: jeandupont                 ║
╠══════════════════════════════════════╣
║  📅 Reçue le: 22/05/2026 18:30      ║
╚══════════════════════════════════════╝

[✅ Accepter] [❌ Refuser] [💬 Discuter sur le site]
```

#### Ticket SERVICE (Demande de projet)

Quand un formulaire "Demander un service" est vérifié :

1. Le bot crée un **thread** dans `#nouvelles-demandes`
2. Le thread est nommé : `🟡 [Titre du projet] — [Type de service]`
3. **Ping automatique** des rôles correspondants : `@Monteur @Graphiste`
4. Embed riche :

```
╔══════════════════════════════════════╗
║  🎯 NOUVELLE DEMANDE DE PROJET      ║
║  Code: NS-S-B3M8P1                  ║
╠══════════════════════════════════════╣
║                                      ║
║  📋 Projet                           ║
║  Titre: Vidéo promo startup          ║
║  Services: Montage Vidéo, Graphisme  ║
║                                      ║
║  📝 Description                      ║
║  "Nous cherchons un monteur pour     ║
║  créer une vidéo promotionnelle..."  ║
║                                      ║
║  ⚙️ Paramètres                       ║
║  Volume: Moyen (1-3 jours)           ║
║  Complexité: Moyenne                 ║
║  Urgence: Standard                   ║
║  Type: Création from scratch         ║
║  Révisions: 2                        ║
║  Usage commercial: Oui               ║
║  Droits exclusifs: Non               ║
║                                      ║
║  💰 Estimation                       ║
║  Fourchette: 195€ — 520€            ║
║  Budget client: max 400€             ║
║                                      ║
║  📅 Deadline souhaitée: 15/06/2026   ║
║                                      ║
║  👤 Client                           ║
║  Nom: StartupXYZ                     ║
║  Email: contact@startupxyz.com ✅    ║
╠══════════════════════════════════════╣
║  📅 Reçue le: 22/05/2026 18:30      ║
║  🏷️ @Monteur @Graphiste             ║
╚══════════════════════════════════════╝

[🙋 Accepter la tâche] [📋 Voir sur le site] [❌ Ignorer]
```

### 3.2 Interactions avec les Boutons

#### Bouton "Accepter la tâche" (Créateur)

```
1. Le créateur clique sur 🙋
2. Le bot vérifie que le créateur a le rôle correspondant
3. Modal de confirmation :
   ┌────────────────────────────────────┐
   │ Accepter cette tâche ?             │
   │                                    │
   │ Projet: Vidéo promo startup        │
   │ Estimation: 195€ - 520€           │
   │ Deadline: 15/06/2026               │
   │                                    │
   │ Commentaire (optionnel):           │
   │ [________________________]         │
   │                                    │
   │ [Confirmer] [Annuler]              │
   └────────────────────────────────────┘
4. Si confirmé :
   → TicketAssignment créé en BDD (selfAssigned: true)
   → Embed mis à jour avec le nom du créateur
   → Notification admin (site + Discord)
   → Notification client (email)
   → Message dans le thread : "🎉 @Créateur a accepté cette tâche !"
```

#### Bouton "Accepter" candidature (Admin)

```
1. L'admin clique sur ✅
2. Modal :
   - Message d'accueil personnalisé (optionnel)
   - Rôles à attribuer (multi-select)
3. Si confirmé :
   → Ticket status → ACCEPTED
   → Compte créateur créé en BDD
   → Email envoyé au candidat avec instructions
   → Message Discord : "✅ Candidature acceptée par @Admin"
   → Rôles Discord attribués au candidat (si il rejoint le serveur)
```

#### Bouton "Refuser" candidature (Admin)

```
1. L'admin clique sur ❌
2. Modal :
   - Raison du refus (obligatoire)
   - Message personnalisé (optionnel)
3. Si confirmé :
   → Ticket status → REJECTED
   → Email envoyé avec la raison
   → Thread archivé
```

### 3.3 Synchronisation Chat Bidirectionnelle

```
[Message sur le site]                    [Message sur Discord]
      │                                        │
      ▼                                        ▼
  API interne ──────► Bot Discord         Bot Event Handler
  POST /discord/msg   │                        │
      │               ▼                        ▼
      │          Post message              Webhook vers site
      │          dans le thread            POST /api/webhooks/discord
      │               │                        │
      └───────────────┴────────────────────────┘
                      │
                      ▼
                 Message en BDD
                 (source identifiée pour éviter les boucles)
```

**Anti-boucle** : Chaque message synchronisé porte un flag `fromDiscord: true/false`. Si un message arrive de Discord, on ne le renvoie pas à Discord, et vice versa.

---

## 4. Commandes Slash

### 4.1 Commandes Admin

| Commande | Description | Options |
|----------|-------------|---------|
| `/ticket info <code>` | Afficher les infos d'un ticket | `code`: Code du ticket |
| `/ticket status <code> <status>` | Changer le statut | `code`, `status` |
| `/ticket close <code> [reason]` | Fermer un ticket | `code`, `reason` |
| `/assign <code> <@user>` | Assigner un créateur | `code`, `user` |
| `/unassign <code> <@user>` | Retirer un créateur | `code`, `user` |
| `/invoice create <code> <amount>` | Créer une facture rapide | `code`, `amount` |
| `/stats [period]` | Statistiques globales | `period`: week/month/year |
| `/project status <code>` | Statut d'un projet | `code` |

### 4.2 Commandes Créateur

| Commande | Description | Options |
|----------|-------------|---------|
| `/mytasks` | Voir mes tâches en cours | — |
| `/available` | Voir les tâches disponibles | `category` (optionnel) |
| `/profile` | Voir/modifier mon profil | — |

### 4.3 Exemple d'Implémentation

```typescript
// commands/ticket.ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '@nova-studio/database';

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Gérer les tickets Nova Studio')
  .addSubcommand(sub =>
    sub.setName('info')
      .setDescription("Afficher les infos d'un ticket")
      .addStringOption(opt =>
        opt.setName('code')
          .setDescription('Code du ticket (ex: NS-S-B3M8P1)')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('status')
      .setDescription("Changer le statut d'un ticket")
      .addStringOption(opt =>
        opt.setName('code').setDescription('Code du ticket').setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('new_status')
          .setDescription('Nouveau statut')
          .setRequired(true)
          .addChoices(
            { name: 'En examen', value: 'IN_REVIEW' },
            { name: 'Accepté', value: 'ACCEPTED' },
            { name: 'En cours', value: 'IN_PROGRESS' },
            { name: 'Terminé', value: 'COMPLETED' },
            { name: 'Refusé', value: 'REJECTED' },
          )
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === 'info') {
    const code = interaction.options.getString('code', true);
    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: { assignments: { include: { user: true } } },
    });
    
    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket introuvable.', ephemeral: true });
    }
    
    // Construire et envoyer l'embed...
  }
}
```

---

## 5. Event Handlers

### 5.1 ready.ts

```typescript
// Initialisation du bot
// - Enregistrement des commandes slash
// - Vérification de la structure du serveur (catégories, salons)
// - Connexion à la BDD
// - Log de démarrage
```

### 5.2 interactionCreate.ts

```typescript
// Gère toutes les interactions :
// - Commandes slash → route vers le bon handler
// - Boutons (Accept, Reject, Discuss) → actions correspondantes
// - Modals (confirmation, raison de refus) → traitement
// - Select Menus → filtres, sélections
```

### 5.3 messageCreate.ts

```typescript
// Gère les messages dans les threads de tickets
// - Détecte si le message est dans un thread lié à un ticket
// - Si oui, synchronise le message vers le chat du site
// - Ignore les messages du bot (anti-boucle)
```

---

## 6. Configuration du Bot Discord

### 6.1 Permissions Requises

```
ADMINISTRATOR (pour simplifier) ou :
- Manage Channels
- Manage Threads
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Use Application Commands
- Manage Roles (pour assigner les rôles créateurs)
- Create Public Threads
- Send Messages in Threads
- Mention Everyone (pour les pings de rôles)
```

### 6.2 Intents Discord

```typescript
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
```

### 6.3 Variables d'Environnement

```env
DISCORD_BOT_TOKEN=...
DISCORD_CLIENT_ID=...
DISCORD_GUILD_ID=...

# IDs des salons
DISCORD_CHANNEL_CANDIDATURES=...
DISCORD_CHANNEL_DEMANDES=...
DISCORD_CHANNEL_BOT_LOGS=...

# IDs des rôles
DISCORD_ROLE_ADMIN=...
DISCORD_ROLE_CREATOR=...
DISCORD_ROLE_MONTEUR=...
DISCORD_ROLE_3D=...
DISCORD_ROLE_DEV=...
DISCORD_ROLE_SOUND=...
DISCORD_ROLE_GRAPHISTE=...
DISCORD_ROLE_TRADUCTEUR=...
DISCORD_ROLE_DISCORD_BUILDER=...

# API interne
INTERNAL_API_URL=https://novastudio.com/api/internal
INTERNAL_API_KEY=...

# Base de données
DATABASE_URL=postgresql://...
```

---

## 7. Flux Complet : De la Demande au Projet

```
1. Client remplit le formulaire sur le site
   │
2. Email de vérification envoyé
   │
3. Client vérifie son email
   │
4. ┌─────────────────────────────────────────┐
   │ SIMULTANÉMENT :                         │
   │ • Ticket créé en BDD                    │
   │ • Thread Discord créé avec embed        │
   │ • Rôles concernés pingés sur Discord    │
   │ • Code de discussion généré             │
   │ • Email avec code envoyé au client      │
   └─────────────────────────────────────────┘
   │
5. Créateur voit la notification sur Discord
   │
6. Créateur clique "🙋 Accepter la tâche"
   │
7. ┌─────────────────────────────────────────┐
   │ SIMULTANÉMENT :                         │
   │ • Assignment créé en BDD               │
   │ • Embed Discord mis à jour             │
   │ • Admin notifié (site + Discord)        │
   │ • Client notifié (email)                │
   │ • Chat ouvert entre les parties         │
   └─────────────────────────────────────────┘
   │
8. Admin peut aussi assigner d'autres créateurs
   │
9. Discussions via chat (site ↔ Discord sync)
   │
10. Admin crée le projet et définit le prix
    │
11. Facture envoyée au client (Stripe)
    │
12. Client paie → travail commence
    │
13. Créateur upload les livrables
    │
14. Client approuve → projet terminé
```
