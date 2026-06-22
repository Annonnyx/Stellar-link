# UI/UX & Design System — Nova Studio

## 1. Direction Artistique

### 1.1 Style Général

- **Premium & Moderne** : Inspiré des plateformes SaaS actuelles (Linear, Vercel, Raycast)
- **Minimaliste** : Beaucoup d'espace blanc, typographie forte, peu de couleurs
- **Fluide** : Animations subtiles, transitions douces, micro-interactions
- **Dark Mode First** : Interface sombre par défaut avec option light mode
- **Glassmorphism** : Effets de verre subtils sur certains éléments
- **Gradients** : Dégradés légers pour les CTA et éléments d'accent

### 1.2 Palette de Couleurs

```css
/* Dark Mode (Principal) */
--background:        #0A0A0B;     /* Fond principal */
--background-subtle: #111113;     /* Fond cartes */
--background-muted:  #1A1A1D;     /* Fond éléments surélevés */
--border:            #27272A;     /* Bordures */
--border-hover:      #3F3F46;     /* Bordures hover */

--text-primary:      #FAFAFA;     /* Texte principal */
--text-secondary:    #A1A1AA;     /* Texte secondaire */
--text-muted:        #71717A;     /* Texte tertiaire */

--accent:            #7C3AED;     /* Violet — couleur principale */
--accent-hover:      #8B5CF6;     /* Violet hover */
--accent-subtle:     #7C3AED20;   /* Violet transparent */

--success:           #10B981;     /* Vert */
--warning:           #F59E0B;     /* Orange */
--error:             #EF4444;     /* Rouge */
--info:              #3B82F6;     /* Bleu */

/* Gradient principal */
--gradient-primary: linear-gradient(135deg, #7C3AED, #3B82F6);
--gradient-cta:     linear-gradient(135deg, #7C3AED, #EC4899);

/* Light Mode */
--light-background:  #FFFFFF;
--light-bg-subtle:   #F9FAFB;
--light-text:        #111827;
--light-text-sec:    #6B7280;
--light-border:      #E5E7EB;
```

### 1.3 Typographie

```css
/* Font principale : Inter (texte) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font titres : Cal Sans ou Inter (bold) */
--font-heading: 'Cal Sans', 'Inter', sans-serif;

/* Font mono : JetBrains Mono (codes, prix) */
--font-mono: 'JetBrains Mono', monospace;

/* Échelle typographique */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
--text-6xl:  3.75rem;   /* 60px */
--text-hero: 4.5rem;    /* 72px — Hero section */
```

### 1.4 Spacing & Layout

```css
--radius-sm:  0.375rem;  /* 6px — Petits éléments */
--radius-md:  0.5rem;    /* 8px — Boutons, inputs */
--radius-lg:  0.75rem;   /* 12px — Cartes */
--radius-xl:  1rem;      /* 16px — Modales */
--radius-2xl: 1.5rem;    /* 24px — Sections */

/* Container */
--container-max: 1280px;
--container-padding: 1.5rem; /* 24px */
```

### 1.5 Effets & Animations

```css
/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Glow effect (CTA buttons) */
.glow {
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.3),
              0 0 60px rgba(124, 58, 237, 0.1);
}

/* Transitions standard */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Animations Framer Motion */
// Fade in up (éléments qui apparaissent en scrollant)
{ opacity: 0, y: 20 } → { opacity: 1, y: 0 }

// Stagger children (listes, grilles)
staggerChildren: 0.05s

// Page transitions
{ opacity: 0, x: -10 } → { opacity: 1, x: 0 }
```

---

## 2. Composants UI (shadcn/ui + customs)

### 2.1 Composants shadcn/ui utilisés

| Composant | Usage |
|-----------|-------|
| `Button` | CTAs, actions |
| `Input` | Champs de formulaire |
| `Textarea` | Champs texte long |
| `Select` | Sélections simples |
| `Checkbox` | Cases à cocher |
| `RadioGroup` | Choix exclusifs |
| `Slider` | Heures par semaine |
| `Dialog` | Modales de confirmation |
| `Sheet` | Panneaux latéraux (mobile nav, filtres) |
| `Tabs` | Navigation dans les dashboards |
| `Table` | Listes admin (tickets, factures) |
| `Badge` | Statuts, tags |
| `Card` | Cartes de service, portfolio |
| `Avatar` | Photos de profil |
| `Tooltip` | Info-bulles |
| `Toast` | Notifications éphémères |
| `DropdownMenu` | Menus contextuels |
| `Command` | Barre de commande (admin) |
| `Calendar` | Sélection de dates |
| `Progress` | Barres de progression |
| `Skeleton` | Placeholders de chargement |
| `Separator` | Séparateurs visuels |
| `ScrollArea` | Zones scrollables (chat) |

### 2.2 Composants Customs

| Composant | Description |
|-----------|-------------|
| `MultiStepForm` | Formulaire multi-étapes avec barre de progression |
| `PriceEstimator` | Widget d'estimation de prix en temps réel |
| `ChatWindow` | Interface de chat complète (messages, input, fichiers) |
| `TicketCard` | Carte de ticket avec statut, assignees, résumé |
| `KanbanBoard` | Board de type Kanban pour les projets |
| `FileUploader` | Upload de fichiers avec preview et progression |
| `CodeInput` | Saisie de code de vérification (6 chiffres) |
| `DiscussionCodeBadge` | Badge affichant le code de discussion |
| `ServiceGrid` | Grille des services avec icônes animées |
| `StatCard` | Carte de statistique avec icône et tendance |
| `NotificationBell` | Cloche de notifications avec badge |
| `UserAvatar` | Avatar avec indicateur de statut en ligne |
| `TagInput` | Saisie de tags multiples |
| `RichTextEditor` | Éditeur de texte riche (descriptions) |

---

## 3. Pages — Détail par Écran

### 3.1 Page d'Accueil (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  Services  Portfolio  À Propos  Contact         │
│                              [Rejoindre]  [Demander ➜]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│           Votre vision.                                 │
│           Notre expertise.                              │
│                                                         │
│     L'agence créative qui connecte les meilleurs        │
│     talents aux projets qui comptent.                   │
│                                                         │
│     [Demander un Service ➜]  [Rejoindre l'Agence]      │
│                                                         │
│     ✦ 150+ projets  ✦ 40+ créateurs  ✦ 98% satisf.   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              Nos Services                               │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ 🎬      │ │ 🎨      │ │ 💻      │ │ 🎵      │     │
│  │ Montage │ │ 3D      │ │ Dev     │ │ Sound   │     │
│  │ Vidéo   │ │         │ │         │ │ Design  │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │ 🖌️      │ │ 🌐      │ │ 💬      │                  │
│  │Graphisme│ │ Traduc. │ │ Discord │                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│            Comment ça marche ?                          │
│                                                         │
│  ① Décrivez      ② On estime     ③ On crée     ④ Livré│
│  votre projet    le prix         pour vous     & payé  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│            Nos Réalisations                             │
│                                                         │
│  [Tout] [Vidéo] [3D] [Dev] [Design] [Son]             │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │  Image   │ │  Image   │ │  Image   │               │
│  │  Projet  │ │  Projet  │ │  Projet  │               │
│  │  Client  │ │  Client  │ │  Client  │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         Ce que disent nos clients                       │
│                                                         │
│  ┌────────────────────────────────────┐                 │
│  │ "Nova Studio a transformé notre   │                 │
│  │  projet en réalité..."            │                 │
│  │  — Marie D., CEO StartupXYZ      │                 │
│  └────────────────────────────────────┘                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│       Prêt à donner vie à votre projet ?               │
│                                                         │
│       [Demander un Service ➜]                           │
│       [Rejoindre notre équipe →]                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Footer : Logo | Services | Contact | CGU | Discord    │
│  © 2026 Nova Studio. Tous droits réservés.             │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Formulaire "Rejoindre" (`/join`)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                    [← Retour]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         Rejoindre Nova Studio                           │
│     Montrez-nous ce que vous savez faire.               │
│                                                         │
│  ──●────────○────────○────────○──                       │
│   Identité  Compétences  Motiv.  Contact                │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │                                             │       │
│  │  Prénom *                                   │       │
│  │  [________________________]                 │       │
│  │                                             │       │
│  │  Nom *                                      │       │
│  │  [________________________]                 │       │
│  │                                             │       │
│  │  Pseudo / Nom d'artiste                     │       │
│  │  [________________________]                 │       │
│  │                                             │       │
│  │  Date de naissance *                        │       │
│  │  [📅 JJ/MM/AAAA]                           │       │
│  │                                             │       │
│  │  Pays *                                     │       │
│  │  [▼ Sélectionner un pays]                   │       │
│  │                                             │       │
│  │  Ville                                      │       │
│  │  [________________________]                 │       │
│  │                                             │       │
│  │                          [Suivant →]        │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Formulaire "Demander un Service" (`/request`)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                    [← Retour]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│       Demander un Service                               │
│   Décrivez votre projet, on s'occupe du reste.          │
│                                                         │
│  ──○────────○────────●────────○──                       │
│   Client   Projet   Estimation  Budget                  │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │                                             │       │
│  │  ⚙️ Paramètres d'estimation                 │       │
│  │                                             │       │
│  │  Volume estimé *                            │       │
│  │  ○ Petit (< 1 jour)                         │       │
│  │  ● Moyen (1-3 jours)                        │       │
│  │  ○ Grand (3-7 jours)                        │       │
│  │  ○ Très grand (7+ jours)                    │       │
│  │                                             │       │
│  │  Complexité *                               │       │
│  │  [▼ Moyenne]                                │       │
│  │                                             │       │
│  │  Urgence *                                  │       │
│  │  [▼ Standard (2 semaines+)]                 │       │
│  │                                             │       │
│  │  ┌───────────────────────────────────────┐  │       │
│  │  │  💰 Estimation                        │  │       │
│  │  │                                       │  │       │
│  │  │  195€ — 520€                         │  │       │
│  │  │                                       │  │       │
│  │  │  Détail :                             │  │       │
│  │  │  Base: 150€ × 2j = 300€             │  │       │
│  │  │  Complexité (×1.3): +90€             │  │       │
│  │  │  Urgence (×1.0): +0€                 │  │       │
│  │  │  ...                                  │  │       │
│  │  │                                       │  │       │
│  │  │  ⚠️ Estimation indicative             │  │       │
│  │  └───────────────────────────────────────┘  │       │
│  │                                             │       │
│  │            [← Précédent]  [Suivant →]       │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Vérification Email (`/verify/[ticketId]`)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    📧                                    │
│                                                         │
│         Vérifiez votre adresse email                    │
│                                                         │
│   Un code de vérification a été envoyé à               │
│   j***n@example.com                                     │
│                                                         │
│         ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│         │ 4│ │ 8│ │ 2│ │ 9│ │  │ │  │               │
│         └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│                                                         │
│         [Vérifier →]                                    │
│                                                         │
│   Vous n'avez pas reçu le code ?                       │
│   [Renvoyer le code] (disponible dans 58s)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.5 Code de Discussion (après vérification)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ✅                                    │
│                                                         │
│           Email vérifié avec succès !                   │
│                                                         │
│   Votre code de discussion :                           │
│                                                         │
│   ┌─────────────────────────────────────┐              │
│   │                                     │              │
│   │        NS-S-B3M8P1                  │  [📋 Copier] │
│   │                                     │              │
│   └─────────────────────────────────────┘              │
│                                                         │
│   Conservez ce code pour :                             │
│   • Accéder au chat avec notre équipe                  │
│   • Suivre l'avancement de votre demande               │
│                                                         │
│   Ce code a aussi été envoyé à votre email.            │
│                                                         │
│   [Accéder au Chat →]                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.6 Chat (`/chat/[code]`)

```
┌─────────────────────────────────────────────────────────┐
│  Nova Studio Chat          NS-S-B3M8P1     [Infos ℹ️]  │
├─────────────────────────────────────────────────────────┤
│  Statut: En examen 🟡                                   │
│  Créateur assigné: —                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌── Système ──────────────────────────────────────┐   │
│  │ Bienvenue ! Votre demande a été reçue.          │   │
│  │ Un membre de notre équipe va vous répondre.     │   │
│  └──────────────────────────── 22/05 18:30 ────────┘   │
│                                                         │
│                               ┌── Vous ────────────┐   │
│                               │ Bonjour, j'ai une  │   │
│                               │ question sur le     │   │
│                               │ délai...            │   │
│                               └──── 22/05 18:45 ───┘   │
│                                                         │
│  ┌── Marc (Admin) ─────────────────────────────────┐   │
│  │ Bonjour ! Nous avons bien reçu votre demande.   │   │
│  │ Nous revenons vers vous sous 24h.               │   │
│  └──────────────────────────── 22/05 19:10 ────────┘   │
│                                                         │
│  ┌── Système ──────────────────────────────────────┐   │
│  │ 🎉 Léo (Monteur Vidéo) a accepté votre tâche ! │   │
│  └──────────────────────────── 23/05 10:00 ────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [📎]  Écrivez un message...                   [➤ ]    │
└─────────────────────────────────────────────────────────┘
```

### 3.7 Dashboard Admin (`/admin/dashboard`)

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────┐                                                      │
│  │ NOVA │  Dashboard  Tickets  Projets  Créateurs  Factures   │
│  │STUDIO│                                    🔔 3   👤 Admin  │
│  └──────┘                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Bonjour, Admin 👋                                             │
│                                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ 📋 12      │ │ 🚀 8       │ │ 💰 4 250€  │ │ 👥 23      │ │
│  │ Tickets    │ │ Projets    │ │ Revenu     │ │ Créateurs  │ │
│  │ ouverts    │ │ en cours   │ │ ce mois    │ │ actifs     │ │
│  │ ↑ +3       │ │ ↑ +2       │ │ ↑ +15%     │ │ → stable   │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                                │
│  ┌──────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Revenus (6 derniers mois)│ │ Tickets par catégorie       │ │
│  │ ████                     │ │ 🎬 Montage ████████ 35%     │ │
│  │ ████ ████                │ │ 💻 Dev     ██████ 25%       │ │
│  │ ████ ████ ████           │ │ 🎨 3D      ████ 18%        │ │
│  │ ...                      │ │ ...                         │ │
│  └──────────────────────────┘ └─────────────────────────────┘ │
│                                                                │
│  Derniers tickets                              [Voir tout →]  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 🟡 NS-S-B3M8P1  Vidéo promo startup    il y a 2h  NEW  │ │
│  │ 🟢 NS-J-A7K9X2  Jean Dupont            il y a 5h       │ │
│  │ 🔵 NS-S-C4N2L8  Refonte site web       il y a 1j       │ │
│  │ 🟠 NS-S-D7P3Q9  Sound design jeu       il y a 2j  ⚠️   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3.8 Liste des Tickets Admin (`/admin/tickets`)

```
┌────────────────────────────────────────────────────────────────┐
│  Tickets                                                       │
│                                                                │
│  [Tous] [Candidatures] [Demandes] [Contact]   🔍 Rechercher   │
│  Statut: [Tous ▼]  Trier par: [Date ▼]                       │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Code        │ Type    │ Titre/Nom     │ Statut  │ Date    ││
│  ├─────────────┼─────────┼───────────────┼─────────┼─────────┤│
│  │ NS-S-B3M8P1 │ Service │ Vidéo promo   │ 🟡 New  │ 22/05   ││
│  │ NS-J-A7K9X2 │ Join    │ Jean Dupont   │ 🟢 Rev. │ 22/05   ││
│  │ NS-S-C4N2L8 │ Service │ Refonte site  │ 🔵 Prog │ 21/05   ││
│  │ NS-S-D7P3Q9 │ Service │ Sound design  │ 🟠 Pay  │ 20/05   ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  Showing 1-20 of 47     [◀ Prev]  1  2  3  [Next ▶]          │
└────────────────────────────────────────────────────────────────┘
```

### 3.9 Détail d'un Ticket Admin (`/admin/tickets/[id]`)

```
┌────────────────────────────────────────────────────────────────┐
│  ← Tickets  /  NS-S-B3M8P1                                    │
│                                                                │
│  Vidéo promo startup                                           │
│  Service • Montage Vidéo, Graphisme        🟡 En examen       │
│                                                                │
│  ┌─────────────┬─────────────┬──────────────┐                 │
│  │ 📋 Détails  │ 💬 Chat (3) │ 📁 Fichiers  │                 │
│  └─────────────┴─────────────┴──────────────┘                 │
│                                                                │
│  ┌─ Infos Client ──────────────────────────────────────────┐  │
│  │ Nom: StartupXYZ                                         │  │
│  │ Email: contact@startupxyz.com ✅                         │  │
│  │ Pays: France                                             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Description ───────────────────────────────────────────┐  │
│  │ Nous cherchons un monteur pour créer une vidéo          │  │
│  │ promotionnelle de 2 minutes pour notre startup...       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Estimation ────────────────────────────────────────────┐  │
│  │ Fourchette: 195€ — 520€                                │  │
│  │ Budget client: max 400€                                 │  │
│  │ Prix final: [________] € [Définir]                      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Créateurs Assignés ────────────────────────────────────┐  │
│  │ Aucun créateur assigné                                   │  │
│  │ [+ Assigner un créateur]                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Actions ───────────────────────────────────────────────┐  │
│  │ [Changer le statut ▼] [Créer un projet] [Facturer]     │  │
│  │ [Voir sur Discord ↗]  [Archiver]                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Historique ────────────────────────────────────────────┐  │
│  │ 22/05 18:30 — Ticket créé                               │  │
│  │ 22/05 18:32 — Email vérifié                             │  │
│  │ 22/05 18:32 — Statut → VERIFIED                         │  │
│  │ 22/05 19:00 — Statut → IN_REVIEW (par Admin)            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Responsive Design

### 4.1 Breakpoints

```css
sm:  640px   /* Mobile large */
md:  768px   /* Tablette */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop large */
2xl: 1536px  /* Ultra-wide */
```

### 4.2 Adaptations Mobile

- **Navigation** : Hamburger menu avec Sheet (panneau latéral)
- **Dashboard Admin** : Sidebar collapse en bottom nav
- **Formulaires** : Full-width, un champ par ligne
- **Chat** : Full-screen sur mobile
- **Tableaux** : Scroll horizontal ou vue carte sur mobile
- **Grilles** : 1 colonne sur mobile, 2 sur tablette, 3-4 sur desktop

### 4.3 Considérations Accessibilité

- Contraste WCAG AA minimum (4.5:1 pour le texte)
- Focus visible sur tous les éléments interactifs
- Labels ARIA sur les éléments interactifs
- Navigation clavier complète
- Réduction des animations si `prefers-reduced-motion`
- Textes alternatifs sur toutes les images
