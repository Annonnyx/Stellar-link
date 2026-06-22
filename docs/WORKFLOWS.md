# Flux Utilisateurs (Workflows) — Nova Studio

---

## 1. Flux "Demander un Service" (Client)

### 1.1 Diagramme Complet

```
┌──────────────────────────────────────────────────────────────────┐
│                    FLUX DEMANDE DE SERVICE                        │
└──────────────────────────────────────────────────────────────────┘

[Client visite le site]
        │
        ▼
[Clic "Demander un Service"]
        │
        ▼
┌─────────────────────────────────┐
│  FORMULAIRE MULTI-ÉTAPES        │
│                                 │
│  Étape 1: Infos client          │
│     └─→ Validation Zod          │
│  Étape 2: Description projet    │
│     └─→ Upload fichiers réf.    │
│  Étape 3: Paramètres estimation │
│     └─→ Calcul prix temps réel  │
│  Étape 4: Budget & validation   │
│     └─→ Acceptation CGU         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  SOUMISSION                     │
│                                 │
│  1. Validation finale (Zod)     │
│  2. Upload fichiers → R2        │
│  3. Calcul estimation prix      │
│  4. Création ticket en BDD      │
│     status: PENDING_VERIFICATION│
│  5. Génération code vérif (6ch) │
│  6. Envoi email vérification    │
│     (via Resend)                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  VÉRIFICATION EMAIL             │
│                                 │
│  Client entre le code 6 chiffr. │
│  • Max 5 tentatives             │
│  • Code expire après 1h         │
│  • Option "Renvoyer" (max 3/h)  │
└────────────┬────────────────────┘
             │
             ▼ ✅ Code correct
┌─────────────────────────────────┐
│  ACTIVATION                     │
│                                 │
│  1. Ticket → status: VERIFIED   │
│  2. emailVerified = true        │
│  3. Génération discussionCode   │
│     Format: NS-S-XXXXXX        │
│  4. ┌──────────────────────┐    │
│     │ DISCORD (parallèle)  │    │
│     │ • Créer thread dans  │    │
│     │   #nouvelles-demandes│    │
│     │ • Poster embed riche │    │
│     │ • Ping @rôles        │    │
│     │   concernés          │    │
│     └──────────────────────┘    │
│  5. Email au client :           │
│     • Code de discussion        │
│     • Lien vers le chat         │
│  6. Notification admins         │
│     (site + Discord)            │
└────────────┬────────────────────┘
             │
             ▼
[Client accède au chat via code]
        │
        ▼
┌─────────────────────────────────┐
│  PHASE DE DISCUSSION            │
│                                 │
│  • Client ↔ Admins via chat     │
│  • Admins examinent la demande  │
│  • Questions / précisions       │
│  • Messages sync Discord ↔ Site │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  CRÉATEUR ACCEPTE (ou assigné)  │
│                                 │
│  Option A: Créateur clique      │
│    "Accepter" sur Discord       │
│  Option B: Admin assigne        │
│    depuis le dashboard          │
│                                 │
│  → TicketAssignment créé        │
│  → Créateur rejoint le chat     │
│  → Client notifié (email)       │
│  → Embed Discord mis à jour     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  CRÉATION DU PROJET             │
│                                 │
│  Admin crée un "Project" :      │
│  • Titre, description           │
│  • Prix final confirmé          │
│  • Deadline                     │
│  • Milestones optionnels        │
│  • Créateur(s) assigné(s)       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  FACTURATION                    │
│                                 │
│  Admin génère la facture        │
│  • Stripe Invoice créée         │
│  • Email envoyé au client       │
│  • Lien de paiement Stripe      │
│                                 │
│  Client paie via Stripe         │
│  → Webhook → status: PAID       │
│  → Notification admin/créateur  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  PRODUCTION                     │
│                                 │
│  • Créateur travaille           │
│  • Mise à jour progression      │
│  • Upload livrables             │
│  • Chat client ↔ créateur       │
│  • Révisions si nécessaire      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  LIVRAISON                      │
│                                 │
│  • Livrables finaux uploadés    │
│  • Client télécharge & valide   │
│  • Projet → COMPLETED           │
│  • Archivage du ticket          │
└─────────────────────────────────┘
```

### 1.2 Cas Particuliers

| Cas | Traitement |
|-----|-----------|
| Email non vérifié après 24h | Ticket supprimé automatiquement (cron) |
| Aucun créateur n'accepte après 48h | Notification admin + rappel Discord |
| Client ne paie pas après 7j | Email de rappel automatique |
| Client demande annulation | Admin change statut → CANCELLED, remboursement si payé |
| Litige / désaccord | Admins arbitrent via le chat |

---

## 2. Flux "Rejoindre l'Agence" (Candidat)

```
[Candidat visite le site]
        │
        ▼
[Clic "Rejoindre l'Agence"]
        │
        ▼
┌─────────────────────────────────┐
│  FORMULAIRE CANDIDATURE         │
│  (4 étapes)                     │
│  Identité → Compétences →      │
│  Motivations → Contact          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  VÉRIFICATION EMAIL             │
│  (même process que service)     │
└────────────┬────────────────────┘
             │
             ▼ ✅ Vérifié
┌─────────────────────────────────┐
│  TICKET JOIN CRÉÉ               │
│                                 │
│  1. Code discussion: NS-J-XXX  │
│  2. Thread Discord dans         │
│     #candidatures (admins only) │
│  3. Embed avec toutes les infos │
│  4. Boutons: Accepter/Refuser  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  PHASE D'EXAMEN                 │
│                                 │
│  • Admins examinent le profil   │
│  • Discussion interne Discord   │
│  • Questions au candidat (chat) │
│  • Candidat utilise son code    │
│    pour répondre via le chat    │
└────────┬──────────┬─────────────┘
         │          │
    ✅ Accepté   ❌ Refusé
         │          │
         ▼          ▼
┌──────────────┐  ┌──────────────────────┐
│ ACCEPTATION  │  │ REFUS                │
│              │  │                      │
│ 1. Compte    │  │ 1. Email avec raison │
│    créateur  │  │ 2. Thread archivé    │
│    créé      │  │ 3. Ticket → REJECTED │
│ 2. Email     │  │                      │
│    bienvenue │  └──────────────────────┘
│ 3. Invitation│
│    Discord   │
│ 4. Rôles     │
│    Discord   │
│    attribués │
│ 5. Accès     │
│    espace    │
│    créateur  │
└──────────────┘
```

---

## 3. Flux de Chat (Code de Discussion)

```
[Utilisateur arrive sur /chat/NS-X-XXXXXX]
        │
        ▼
┌─────────────────────────────────┐
│  VÉRIFICATION DU CODE           │
│                                 │
│  1. Recherche ticket par code   │
│  2. Vérifie que le ticket       │
│     existe et est actif         │
│  3. Vérifie que l'email est     │
│     vérifié                     │
└────────────┬────────────────────┘
             │
        ❌ Code invalide → Message d'erreur
        ✅ Code valide ↓
             │
             ▼
┌─────────────────────────────────┐
│  CHARGEMENT DU CHAT             │
│                                 │
│  1. Récupère l'historique       │
│     des messages                │
│  2. Connexion Socket.io         │
│     room: ticket:{ticketId}     │
│  3. Affiche les infos du ticket │
│     (statut, créateur assigné)  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  CHAT ACTIF                     │
│                                 │
│  Envoi message:                 │
│  1. Message envoyé via Socket   │
│  2. Sauvegardé en BDD           │
│  3. Synchronisé vers Discord    │
│  4. Participants notifiés       │
│                                 │
│  Réception message:             │
│  1. Socket.io émet l'événement  │
│  2. Message affiché en temps    │
│     réel dans le chat           │
│  3. Son de notification         │
│                                 │
│  Upload fichier:                │
│  1. Fichier uploadé vers R2     │
│  2. Message de type FILE créé   │
│  3. Preview affiché dans chat   │
└─────────────────────────────────┘
```

---

## 4. Flux Admin — Gestion d'un Ticket SERVICE

```
[Notification: Nouveau ticket SERVICE]
        │
        ▼
┌─────────────────────────────────┐
│  EXAMEN INITIAL                 │
│                                 │
│  1. Admin ouvre le ticket       │
│  2. Lit la description          │
│  3. Vérifie l'estimation        │
│  4. Statut → IN_REVIEW          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  DISCUSSION AVEC LE CLIENT      │
│                                 │
│  Via le chat du ticket :        │
│  • Poser des questions          │
│  • Demander des précisions      │
│  • Négocier le prix/délai       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  ASSIGNATION                    │
│                                 │
│  Option A: Un créateur accepte  │
│    via Discord → auto-assigné   │
│                                 │
│  Option B: Admin assigne        │
│    manuellement :               │
│    • Recherche par compétence   │
│    • Vérifie la disponibilité   │
│    • Peut assigner PLUSIEURS    │
│      créateurs à 1 projet       │
│                                 │
│  → Statut → ASSIGNED            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  DÉFINITION DU PRIX FINAL      │
│                                 │
│  • Admin saisit le prix final   │
│  • Basé sur l'estimation        │
│    + discussion avec le client  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  CRÉATION DU PROJET             │
│                                 │
│  Admin clique "Créer un projet" │
│  • Titre (pré-rempli)           │
│  • Description                  │
│  • Prix final                   │
│  • Deadline                     │
│  • Milestones (optionnel)       │
│  • Créateur(s) pré-sélectionnés │
│                                 │
│  → Channel Discord projet créé  │
│  → Ticket lié au projet         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  FACTURATION                    │
│                                 │
│  Admin clique "Facturer" :      │
│  • Lignes de facture            │
│  • TVA (si applicable)          │
│  • Date d'échéance              │
│  • Notes                        │
│                                 │
│  → Stripe Invoice créée         │
│  → Envoyée par email au client  │
│  → Lien de paiement généré      │
└────────────┬────────────────────┘
             │
             ▼
[Suivi de la production via le dashboard]
        │
        ▼
[Projet terminé → archivage]
```

---

## 5. Flux Créateur — Accepter une Tâche

### 5.1 Via Discord

```
[Créateur voit un ping dans #nouvelles-demandes]
        │
        ▼
[Lit l'embed du ticket]
        │
        ├── [❌ Ignorer] → Rien ne se passe
        │
        └── [🙋 Accepter la tâche]
                │
                ▼
        ┌─────────────────────────┐
        │ MODAL DE CONFIRMATION   │
        │                         │
        │ Confirmer l'acceptation │
        │ + Commentaire optionnel │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ POST-ACCEPTATION        │
        │                         │
        │ 1. Assignment BDD       │
        │ 2. Embed mis à jour     │
        │ 3. Notif admin          │
        │ 4. Email client         │
        │ 5. Accès au chat        │
        │ 6. Channel projet créé  │
        └─────────────────────────┘
```

### 5.2 Via le Site (Espace Créateur)

```
[Créateur se connecte à /creator/dashboard]
        │
        ▼
[Onglet "Tâches disponibles"]
        │
        ▼
[Liste filtrée par ses compétences]
        │
        ▼
[Clic sur une tâche → voir les détails]
        │
        ▼
[Bouton "Accepter cette tâche"]
        │
        ▼
[Confirmation → même flux que Discord]
```

---

## 6. Flux de Paiement

```
[Admin crée la facture]
        │
        ▼
┌─────────────────────────────────┐
│  STRIPE INVOICE CRÉÉE           │
│                                 │
│  • Lignes de facturation        │
│  • Montant total + TVA          │
│  • Lien de paiement             │
│  • Statut: DRAFT                │
└────────────┬────────────────────┘
             │
             ▼
[Admin clique "Envoyer"]
             │
             ▼
┌─────────────────────────────────┐
│  ENVOI                          │
│                                 │
│  1. Stripe envoie l'email       │
│  2. Resend envoie un email      │
│     personnalisé avec lien      │
│  3. Facture → status: SENT      │
│  4. Message système dans le     │
│     chat du ticket              │
└────────────┬────────────────────┘
             │
             ▼
[Client clique le lien de paiement]
             │
             ▼
┌─────────────────────────────────┐
│  STRIPE CHECKOUT                │
│                                 │
│  • Paiement carte bancaire      │
│  • Paiement sécurisé 3DS        │
└────────────┬────────────────────┘
             │
        ❌ Échec → Email relance
        ✅ Succès ↓
             │
             ▼
┌─────────────────────────────────┐
│  WEBHOOK STRIPE                 │
│                                 │
│  Event: invoice.paid            │
│                                 │
│  1. Facture → status: PAID      │
│  2. Projet → status: IN_PROGRESS│
│  3. Notification admin          │
│     (site + Discord)            │
│  4. Notification créateur       │
│     (site + Discord)            │
│  5. Email confirmation client   │
│  6. Message système dans chat   │
└─────────────────────────────────┘
```

---

## 7. Matrice des Notifications

### 7.1 Qui est notifié quand ?

| Événement | Admin (Site) | Admin (Discord) | Admin (Email) | Client (Email) | Client (Chat) | Créateur (Site) | Créateur (Discord) | Créateur (Email) |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Nouveau ticket | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (si SERVICE) | ❌ |
| Email vérifié | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Nouveau message client | ✅ | ✅ | ✅* | ❌ | ❌ | ✅** | ✅** | ✅** |
| Créateur accepte | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Admin assigne créateur | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Projet créé | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Facture envoyée | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Paiement reçu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Livrable uploadé | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Projet terminé | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Candidature acceptée | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Candidature refusée | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

*\* Si admin est offline (pas connecté au dashboard)*
*\*\* Si créateur est assigné au ticket*

---

## 8. Jobs Automatisés (Cron)

| Job | Fréquence | Action |
|-----|-----------|--------|
| `cleanup-unverified` | Toutes les heures | Supprime les tickets non vérifiés > 24h |
| `reminder-no-response` | Quotidien | Notifie si un ticket vérifié n'a pas de réponse admin > 48h |
| `reminder-no-creator` | Quotidien | Notifie si aucun créateur n'a accepté une tâche > 48h |
| `invoice-overdue` | Quotidien | Marque les factures en retard et envoie un rappel |
| `project-deadline` | Quotidien | Notifie si un projet approche de sa deadline (J-3, J-1) |
| `stats-daily` | Quotidien | Génère les statistiques quotidiennes |
