# Spécifications Fonctionnelles — Nova Studio

---

## 1. Site Vitrine (Public)

### 1.1 Page d'Accueil

- **Hero Section** : Titre accrocheur, sous-titre, CTA "Demander un Service" + "Rejoindre l'Agence"
- **Section Services** : Grille des 7 domaines avec icônes animées
  - Montage Vidéo
  - 3D
  - Développement
  - Ingénierie Son / Sound Design
  - Graphisme
  - Traduction
  - Création de Serveurs Discord
- **Section "Comment ça marche"** : 3-4 étapes illustrées (Demander → Estimer → Créer → Livrer)
- **Section Portfolio** : Carrousel/grille de réalisations (filtrable par catégorie)
- **Section Témoignages** : Avis clients
- **Section Équipe** : Présentation de l'équipe fondatrice
- **Section Stats** : Chiffres clés (projets réalisés, clients, créateurs…)
- **Footer** : Liens, réseaux sociaux, mentions légales

### 1.2 Page Services

- Détail de chaque service avec :
  - Description complète
  - Exemples de réalisations
  - Fourchette de prix indicative
  - CTA "Demander ce service"
- Filtrage par catégorie

### 1.3 Page À Propos

- Histoire de Nova Studio
- Valeurs et mission
- Équipe fondatrice avec photos et rôles
- Processus de travail

### 1.4 Page Portfolio

- Grille de projets réalisés
- Filtres par catégorie de service
- Page de détail par projet : description, images/vidéos, client, durée

### 1.5 Page Contact

- Formulaire de contact simple (nom, email, message)
- Liens Discord, réseaux sociaux
- FAQ

---

## 2. Formulaire "Rejoindre l'Agence"

### 2.1 Structure du Formulaire (Multi-étapes)

Le formulaire est divisé en **4 étapes** avec barre de progression :

#### Étape 1 — Identité

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Prénom | Texte | ✅ | |
| Nom | Texte | ✅ | |
| Pseudo / Nom d'artiste | Texte | ❌ | |
| Date de naissance | Date | ✅ | Vérification 16+ |
| Pays | Select | ✅ | Liste ISO |
| Ville | Texte | ❌ | |
| Photo de profil | Upload image | ❌ | Max 5MB |

#### Étape 2 — Compétences & Expérience

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Domaines de compétence | Multi-select | ✅ | Montage, 3D, Dev, Son, Graphisme, Traduction, Discord, Autre |
| Sous-spécialités | Tags input | ❌ | Ex: "After Effects", "Blender", "React"… |
| Niveau d'expérience | Select | ✅ | Débutant / Intermédiaire / Avancé / Expert |
| Années d'expérience | Number | ✅ | |
| Portfolio / liens | Multi-URL input | ✅ | Min 1 lien (site, Behance, GitHub, etc.) |
| CV / Portfolio PDF | Upload fichier | ❌ | Max 10MB, PDF uniquement |
| Logiciels maîtrisés | Tags input | ❌ | |
| Langues parlées | Multi-select | ✅ | Avec niveau (natif/courant/intermédiaire) |

#### Étape 3 — Motivations

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Pourquoi rejoindre Nova Studio ? | Textarea | ✅ | Min 100 caractères |
| Disponibilité | Select | ✅ | Temps plein / Mi-temps / Occasionnel / Week-end |
| Heures par semaine estimées | Slider | ✅ | 5-40h |
| Tarif horaire souhaité (€) | Number | ❌ | Indicatif |
| Expérience freelance ? | Radio | ✅ | Oui / Non |
| Déjà travaillé en agence ? | Radio | ✅ | Oui / Non |
| Comment avez-vous connu Nova Studio ? | Select | ✅ | Discord, réseaux sociaux, bouche à oreille, autre |

#### Étape 4 — Contact & Validation

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Email | Email | ✅ | Sera vérifié |
| Discord (username) | Texte | ✅ | Format validé |
| Téléphone | Tel | ❌ | Format international |
| Site personnel | URL | ❌ | |
| Acceptation CGU | Checkbox | ✅ | Lien vers CGU |
| Acceptation confidentialité | Checkbox | ✅ | |

### 2.2 Après Soumission

1. **Écran de vérification email** : "Un code de vérification a été envoyé à votre adresse email"
2. L'utilisateur entre le **code à 6 chiffres** reçu par email
3. Si vérifié :
   - Affichage du **Code de Discussion** (ex: `NS-J-A7K9X2`)
   - Le code est aussi envoyé par email
   - Instructions : "Conservez ce code pour suivre votre candidature et discuter avec notre équipe"
4. Un **ticket de type JOIN** est créé sur le site et sur Discord

---

## 3. Formulaire "Demander un Service"

### 3.1 Structure du Formulaire (Multi-étapes)

#### Étape 1 — Informations Client

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Nom complet / Entreprise | Texte | ✅ | |
| Email professionnel | Email | ✅ | |
| Discord (username) | Texte | ❌ | |
| Téléphone | Tel | ❌ | |
| Pays | Select | ✅ | |

#### Étape 2 — Description du Projet

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Type de service | Multi-select | ✅ | Montage, 3D, Dev, Son, Graphisme, Traduction, Discord |
| Titre du projet | Texte | ✅ | Max 100 caractères |
| Description détaillée | Textarea | ✅ | Min 50 caractères, rich text optionnel |
| Fichiers de référence | Multi-upload | ❌ | Images, vidéos, docs — Max 50MB total |
| Liens de référence | Multi-URL | ❌ | Exemples d'inspiration |
| Deadline souhaitée | Date | ❌ | Date picker, minimum J+3 |

#### Étape 3 — Paramètres d'Estimation

Cette étape génère une **estimation de prix en temps réel** à l'aide d'un algorithme.

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Volume estimé | Select | ✅ | Petit (< 1 jour), Moyen (1-3 jours), Grand (3-7 jours), Très grand (7+ jours) |
| Complexité | Select | ✅ | Simple, Moyenne, Complexe, Très complexe |
| Urgence | Select | ✅ | Standard (2 sem+), Rapide (1 sem), Urgent (< 3 jours), Express (24-48h) |
| Utilisation de productions existantes | Radio | ✅ | Oui (modification/adaptation) / Non (création from scratch) |
| Si oui : fichiers sources | Multi-upload | Conditionnel | Fichiers sources existants |
| Nombre de révisions souhaitées | Select | ✅ | 1, 2, 3, Illimitées |
| Usage commercial ? | Radio | ✅ | Oui / Non (impacte le prix) |
| Droits exclusifs ? | Radio | ✅ | Oui / Non (impacte le prix) |

**Algorithme d'Estimation (affiché en temps réel) :**

```
Prix de base (par service) :
  - Montage Vidéo : 50-200€/jour
  - 3D : 80-300€/jour
  - Développement : 100-350€/jour
  - Sound Design : 60-250€/jour
  - Graphisme : 50-200€/jour
  - Traduction : 0.08-0.15€/mot
  - Discord : 100-500€ forfait

Multiplicateurs :
  × Complexité : Simple(1.0), Moyenne(1.3), Complexe(1.7), Très complexe(2.2)
  × Urgence : Standard(1.0), Rapide(1.2), Urgent(1.5), Express(2.0)
  × Révisions : 1(1.0), 2(1.1), 3(1.2), Illimitées(1.4)
  × Droits exclusifs : Non(1.0), Oui(1.3)
  × Commercial : Non(1.0), Oui(1.15)
  × From scratch vs modification : Scratch(1.0), Modification(0.7)

Estimation affichée = Fourchette [Prix_min - Prix_max]
Note : "Cette estimation est indicative. Le prix final sera confirmé après étude de votre projet."
```

#### Étape 4 — Budget & Validation

| Champ | Type | Obligatoire | Détails |
|-------|------|-------------|---------|
| Budget maximum | Number (€) | ❌ | Optionnel, permet d'ajuster |
| Estimation calculée | Affichage | — | Non modifiable, fourchette min-max |
| Commentaires additionnels | Textarea | ❌ | |
| Acceptation CGU | Checkbox | ✅ | |
| Acceptation devis indicatif | Checkbox | ✅ | "Je comprends que le prix final peut différer" |

### 3.2 Après Soumission

1. **Vérification email** (même process que pour rejoindre)
2. **Code de Discussion** généré (format : `NS-S-B3M8P1`)
3. **Ticket de type SERVICE** créé :
   - Sur le site (visible admin dashboard)
   - Sur Discord : embed dans un salon dédié avec **ping des créateurs** correspondant aux compétences demandées
4. Les créateurs voient le ticket et peuvent **accepter** ou **ignorer** la tâche

---

## 4. Système de Tickets

### 4.1 Types de Tickets

| Type | Préfixe | Source | Destinataires |
|------|---------|--------|---------------|
| **JOIN** | `NS-J-` | Formulaire "Rejoindre" | Admins uniquement |
| **SERVICE** | `NS-S-` | Formulaire "Demander un service" | Admins + Créateurs concernés |
| **CONTACT** | `NS-C-` | Formulaire de contact | Admins uniquement |

### 4.2 Statuts de Ticket

```
PENDING_VERIFICATION  → En attente de vérification email
VERIFIED              → Email vérifié, en attente de traitement
IN_REVIEW             → En cours d'examen par les admins
ACCEPTED              → Candidature/demande acceptée
ASSIGNED              → Créateur(s) assigné(s) au projet
IN_PROGRESS           → Travail en cours
PENDING_PAYMENT       → En attente de paiement
COMPLETED             → Terminé
REJECTED              → Refusé
CANCELLED             → Annulé
```

### 4.3 Données d'un Ticket

```typescript
interface Ticket {
  id: string;                    // UUID
  code: string;                  // NS-J-XXXXXX ou NS-S-XXXXXX
  type: 'JOIN' | 'SERVICE' | 'CONTACT';
  status: TicketStatus;
  
  // Soumetteur
  submitterName: string;
  submitterEmail: string;
  submitterDiscord?: string;
  emailVerified: boolean;
  
  // Code de discussion
  discussionCode: string;        // Code unique pour accéder au chat
  
  // Données du formulaire (JSON)
  formData: Record<string, any>;
  
  // Estimation (pour SERVICE uniquement)
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  finalPrice?: number;
  
  // Relations
  assignedCreators: Creator[];   // Créateurs assignés
  messages: Message[];           // Messages du chat
  project?: Project;             // Projet lié (si créé)
  
  // Discord
  discordChannelId?: string;     // ID du channel/thread Discord
  discordMessageId?: string;     // ID du message embed Discord
  
  // Métadonnées
  createdAt: DateTime;
  updatedAt: DateTime;
  closedAt?: DateTime;
}
```

### 4.4 Ticket sur Discord

**Ticket JOIN :**
- Créé dans un salon `#candidatures` (visible admins uniquement)
- Embed avec : identité, compétences, motivations, liens portfolio
- Boutons : ✅ Accepter | ❌ Refuser | 💬 Discuter

**Ticket SERVICE :**
- Créé dans un salon `#demandes-projets` (visible admins + créateurs)
- Embed avec : description projet, services demandés, estimation, deadline
- **Ping automatique** des rôles Discord correspondants (ex: `@Monteur`, `@Dev`, `@3D`)
- Boutons : 🙋 Accepter la tâche | 📋 Voir détails

---

## 5. Système de Chat

### 5.1 Accès au Chat

**Pour les clients/recrues (sans compte) :**
- Accès via URL : `novastudio.com/chat/NS-X-XXXXXX`
- Saisie du code de discussion → accès au chat

**Pour les admins (avec compte) :**
- Accès via le dashboard admin → section "Tickets" → clic sur un ticket → onglet "Chat"

**Pour les créateurs (avec compte) :**
- Accès via l'espace créateur → section "Tâches" → clic sur une tâche → onglet "Chat"

### 5.2 Fonctionnalités du Chat

- Messages texte en temps réel (Socket.io)
- Upload de fichiers (images, documents, vidéos)
- Indicateur de frappe
- Indicateur de lecture
- Horodatage des messages
- Notifications email si l'autre partie est offline
- Historique complet
- **Synchronisation Discord** : les messages envoyés sur le site apparaissent aussi dans le thread Discord lié au ticket, et vice versa

### 5.3 Participants par Type de Ticket

| Type de Ticket | Participants au Chat |
|---------------|---------------------|
| **JOIN** | Candidat (via code) + Admins |
| **SERVICE** | Client (via code) + Admins + Créateur(s) assigné(s) |

---

## 6. Dashboard Admin

### 6.1 Vue d'Ensemble

- **Statistiques** : Tickets ouverts, projets en cours, revenus du mois, créateurs actifs
- **Graphiques** : Évolution revenus, tickets par catégorie, taux de conversion
- **Actions rapides** : Derniers tickets, messages non lus, tâches urgentes

### 6.2 Gestion des Tickets

- **Liste filtrable** : Par type, statut, date, créateur assigné
- **Vue détaillée** : Toutes les infos du formulaire, historique des statuts, chat intégré
- **Actions admin** :
  - Changer le statut
  - Assigner un ou plusieurs créateurs
  - Définir le prix final
  - Créer un projet à partir du ticket
  - Envoyer une facture
  - Archiver / Supprimer

### 6.3 Gestion des Projets

- **Kanban board** : Colonnes par statut (En attente, En cours, Révision, Terminé)
- **Vue détaillée** :
  - Infos client
  - Créateur(s) assigné(s)
  - Progression (pourcentage)
  - Fichiers livrables
  - Historique des révisions
  - Chat intégré
  - Factures liées

### 6.4 Gestion des Créateurs

- **Liste des créateurs** : Avec compétences, disponibilité, note, projets en cours
- **Profil détaillé** : Portfolio, historique projets, statistiques
- **Actions** : Activer/Désactiver, modifier rôle, assigner à un projet

### 6.5 Gestion des Clients

- **Liste des clients** : Avec projets, factures, historique
- **Profil détaillé** : Historique complet des interactions

### 6.6 Facturation

- **Liste des factures** : Filtrable par statut (brouillon, envoyée, payée, en retard)
- **Création de facture** : Depuis un ticket/projet, avec détail des lignes
- **Envoi automatique** : Via Stripe + email
- **Suivi des paiements** : Webhooks Stripe

### 6.7 Paramètres

- Gestion des catégories de service
- Configuration des prix de base
- Gestion des rôles et permissions
- Configuration Discord (salons, rôles à ping)
- Templates d'email
- CGU et mentions légales

---

## 7. Espace Client

### 7.1 Accès

- Via code de discussion (pas besoin de compte) — vue limitée au ticket/projet
- Via compte client optionnel — vue de tous ses projets

### 7.2 Fonctionnalités

- **Dashboard** : Projets en cours, messages récents
- **Projets** : Suivi de l'avancement, fichiers livrables à télécharger
- **Chat** : Communication avec l'équipe
- **Factures** : Voir et payer les factures (lien Stripe Checkout)
- **Historique** : Tous les projets passés

---

## 8. Espace Créateur

### 8.1 Accès

- Compte créateur (créé après acceptation de la candidature)
- Auth via Discord OAuth

### 8.2 Fonctionnalités

- **Dashboard** : Tâches assignées, tâches disponibles, revenus
- **Tâches disponibles** : Tickets SERVICE non assignés correspondant à ses compétences
  - Bouton "Accepter cette tâche"
- **Tâches en cours** : Progression, upload livrables, chat
- **Profil** : Modifier compétences, disponibilité, portfolio
- **Revenus** : Historique des paiements reçus (future: Stripe Connect)

---

## 9. Système de Paiement

### 9.1 Flux de Paiement

```
1. Admin définit le prix final du projet
2. Admin génère une facture (Stripe Invoice)
3. Client reçoit la facture par email
4. Client paie via Stripe Checkout
5. Webhook Stripe → mise à jour statut
6. Notification admin + créateur
7. (Futur) Paiement créateur via Stripe Connect
```

### 9.2 Options de Paiement

- Paiement unique
- Paiement en plusieurs fois (acompte + solde)
- Paiement par milestone (pour gros projets)

---

## 10. Système de Notifications

### 10.1 Canaux de Notification

| Événement | Site (temps réel) | Email | Discord |
|-----------|:-:|:-:|:-:|
| Nouveau ticket | ✅ Admin | ✅ Admin | ✅ Salon dédié |
| Email vérifié | ✅ Admin | ❌ | ✅ Update embed |
| Nouveau message chat | ✅ Tous participants | ✅ Si offline | ✅ Thread lié |
| Créateur accepte tâche | ✅ Admin | ✅ Client | ✅ Notification |
| Projet assigné | ✅ Créateur | ✅ Créateur | ✅ DM ou ping |
| Statut projet changé | ✅ Client + Créateur | ✅ Client | ✅ Thread |
| Facture envoyée | ✅ Client | ✅ Client | ✅ Notification admin |
| Paiement reçu | ✅ Admin | ✅ Admin + Client | ✅ Notification |
| Candidature acceptée/refusée | ❌ | ✅ Candidat | ✅ DM |
