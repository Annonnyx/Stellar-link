# Stack Technologique — Nova Studio

## 1. Résumé

| Catégorie | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework Web** | Next.js | 15.x | App Router, SSR/SSG, API Routes, écosystème React |
| **UI Framework** | React | 19.x | Composants, Server Components, hooks |
| **Styling** | TailwindCSS | 4.x | Utility-first, design system rapide, dark mode |
| **Composants UI** | shadcn/ui | latest | Composants accessibles, personnalisables, modernes |
| **Animations** | Framer Motion | 12.x | Animations fluides, transitions de page |
| **Icônes** | Lucide React | latest | Icônes cohérentes, légères |
| **Formulaires** | React Hook Form + Zod | latest | Validation type-safe, performant |
| **State Management** | Zustand | 5.x | Léger, simple, pas de boilerplate |
| **API** | tRPC | 11.x | API type-safe end-to-end, intégration Next.js |
| **ORM** | Prisma | 6.x | Type-safe, migrations, introspection |
| **Base de données** | PostgreSQL | 16.x | Relationnel robuste, JSONB, full-text search |
| **Cache** | Redis (Upstash) | — | Sessions Socket.io, rate limiting, cache |
| **Auth** | Auth.js (NextAuth v5) | 5.x | OAuth Discord, sessions, RBAC |
| **Temps réel** | Socket.io | 4.x | WebSocket fiable, rooms, reconnexion auto |
| **Email** | Resend + React Email | latest | API moderne, templates React, deliverability |
| **Paiement** | Stripe | latest | Standard industrie, webhooks, factures |
| **Fichiers** | Cloudflare R2 | — | S3-compatible, pas de frais egress |
| **Bot Discord** | discord.js | 14.x | Lib officielle, slash commands, embeds |
| **Monorepo** | Turborepo | 2.x | Build incrémental, task pipeline |
| **Package Manager** | pnpm | 9.x | Rapide, efficace, workspaces natifs |
| **Langage** | TypeScript | 5.x | Typage strict partout |
| **Linting** | ESLint + Prettier | latest | Cohérence du code |
| **Testing** | Vitest + Playwright | latest | Tests unitaires + E2E |
| **Déploiement Web** | Vercel | — | Intégration Next.js native, edge functions |
| **Déploiement Bot** | VPS (Hetzner/OVH) | — | Process long, Socket.io server |
| **CI/CD** | GitHub Actions | — | Automatisation build, tests, déploiement |

---

## 2. Justifications Détaillées

### 2.1 Next.js 15 (App Router)

**Pourquoi Next.js plutôt qu'un frontend + backend séparés ?**

- **Server Components** : Le site vitrine (SEO critique) bénéficie du rendu côté serveur sans JS côté client
- **API Routes** : Pas besoin d'un backend Express/Fastify séparé pour les endpoints API
- **tRPC intégré** : Communication type-safe entre le frontend et le backend dans le même projet
- **Middleware** : Auth, rate limiting, redirections au niveau edge
- **Image Optimization** : Optimisation automatique des images du portfolio
- **ISR** : Pages statiques avec revalidation pour le site vitrine (performances maximales)

### 2.2 tRPC vs REST vs GraphQL

| Critère | REST | GraphQL | tRPC ✅ |
|---------|------|---------|--------|
| Type-safety | ❌ Manuel | ⚠️ Codegen | ✅ Natif |
| Complexité setup | ✅ Simple | ❌ Élevée | ✅ Simple |
| DX (Developer Experience) | ⚠️ Moyen | ⚠️ Moyen | ✅ Excellent |
| Autocomplétion | ❌ Non | ⚠️ Avec codegen | ✅ Instantanée |
| Performance | ✅ Bonne | ⚠️ Over-fetching possible | ✅ Bonne |
| Adapté pour monorepo TS | ⚠️ | ⚠️ | ✅ Parfait |

tRPC est idéal car le frontend et le backend partagent le même runtime TypeScript.

### 2.3 PostgreSQL + Prisma

- **PostgreSQL** : Idéal pour les relations complexes (tickets ↔ créateurs ↔ projets ↔ messages)
- **JSONB** : Stockage flexible des métadonnées de tickets et des paramètres d'estimation
- **Full-text search** : Recherche dans les tickets et messages sans ElasticSearch
- **Prisma** : ORM type-safe, migrations versionnées, studio de debug, relation handling excellent

### 2.4 Socket.io vs Alternatives

| Solution | Avantages | Inconvénients |
|----------|-----------|---------------|
| **Socket.io** ✅ | Fiable, rooms, reconnexion, fallback polling | Lib côté serveur nécessaire |
| Pusher | Hosted, pas de serveur | Coût élevé à l'échelle, latence |
| Ably | Hosted, fiable | Coût, complexité |
| Server-Sent Events | Simple, natif | Unidirectionnel uniquement |
| WebSocket natif | Léger | Pas de rooms, pas de reconnexion auto |

Socket.io est choisi pour sa fiabilité, son système de rooms (un room par ticket/projet), et sa gestion automatique de la reconnexion.

### 2.5 Resend + React Email

- **Resend** : API email moderne avec excellent deliverability, dashboard de suivi
- **React Email** : Templates email écrits en React/TSX, prévisualisables, maintenables
- Emails nécessaires :
  - Vérification d'email (code 6 chiffres)
  - Code de discussion
  - Notification de nouveau message
  - Facture / confirmation de paiement
  - Notification d'assignation (créateur)

### 2.6 Discord Bot (discord.js v14)

- Lib officielle et la plus maintenue pour les bots Discord
- Support natif des slash commands, boutons, modals, select menus
- Système d'embeds riche pour afficher les tickets
- Gestion des permissions par rôle

### 2.7 Stripe

- Standard industrie pour les paiements en ligne
- Webhooks pour synchroniser les statuts de paiement
- Stripe Checkout pour les paiements simples
- Stripe Invoicing pour la génération de factures
- Stripe Connect possible pour payer les créateurs (évolution future)

---

## 3. Dépendances Clés (package.json)

### 3.1 Application Web (`apps/web`)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@prisma/client": "^6.0.0",
    "next-auth": "^5.0.0",
    "@auth/prisma-adapter": "latest",
    "socket.io": "^4.8.0",
    "socket.io-client": "^4.8.0",
    "stripe": "^17.0.0",
    "resend": "^4.0.0",
    "@react-email/components": "latest",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zustand": "^5.0.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "latest",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "date-fns": "^4.0.0",
    "nanoid": "^5.0.0",
    "uploadthing": "latest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "prisma": "^6.0.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "eslint": "^9.0.0",
    "vitest": "^2.0.0",
    "@playwright/test": "latest"
  }
}
```

### 3.2 Bot Discord (`apps/discord-bot`)

```json
{
  "dependencies": {
    "discord.js": "^14.16.0",
    "@prisma/client": "^6.0.0",
    "zod": "^3.23.0",
    "dotenv": "^16.4.0",
    "node-cron": "^3.0.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0"
  }
}
```

### 3.3 Packages Partagés (`packages/shared`)

```json
{
  "dependencies": {
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

---

## 4. Configuration Monorepo

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "db:push": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```
