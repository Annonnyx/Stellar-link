# Infrastructure & Déploiement — Nova Studio

---

## 1. Vue d'Ensemble de l'Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                                   │
│                                                                      │
│  ┌─────────────────────┐     ┌──────────────────────────────────┐   │
│  │      VERCEL          │     │         VPS (Hetzner)            │   │
│  │                      │     │                                  │   │
│  │  ┌────────────────┐  │     │  ┌──────────────────────────┐   │   │
│  │  │  Next.js App   │  │     │  │   Docker Compose          │   │   │
│  │  │  (SSR/SSG/API) │  │     │  │                           │   │   │
│  │  └────────────────┘  │     │  │  ┌─────────────────────┐  │   │   │
│  │                      │     │  │  │  Discord Bot         │  │   │   │
│  │  ┌────────────────┐  │     │  │  │  (discord.js)        │  │   │   │
│  │  │  Edge          │  │     │  │  └─────────────────────┘  │   │   │
│  │  │  Middleware     │  │     │  │                           │   │   │
│  │  └────────────────┘  │     │  │  ┌─────────────────────┐  │   │   │
│  │                      │     │  │  │  Socket.io Server    │  │   │   │
│  │  ┌────────────────┐  │     │  │  │  (temps réel)        │  │   │   │
│  │  │  Vercel Cron   │  │     │  │  └─────────────────────┘  │   │   │
│  │  │  (jobs)        │  │     │  │                           │   │   │
│  │  └────────────────┘  │     │  │  ┌─────────────────────┐  │   │   │
│  └─────────────────────┘     │  │  │  Redis               │  │   │   │
│                               │  │  │  (cache/sessions)    │  │   │   │
│                               │  │  └─────────────────────┘  │   │   │
│                               │  └──────────────────────────┘   │   │
│                               └──────────────────────────────────┘   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    SERVICES MANAGÉS                            │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────┐  ┌────────────────────────┐  │   │
│  │  │  Neon /       │  │ Upstash  │  │  Cloudflare R2         │  │   │
│  │  │  Supabase     │  │ Redis    │  │  (fichiers)            │  │   │
│  │  │  (PostgreSQL) │  │          │  │                        │  │   │
│  │  └──────────────┘  └──────────┘  └────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────┐  ┌────────────────────────┐  │   │
│  │  │  Stripe      │  │  Resend  │  │  Discord API           │  │   │
│  │  │  (paiements) │  │  (email) │  │  (bot + webhooks)      │  │   │
│  │  └──────────────┘  └──────────┘  └────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                         DNS & CDN                             │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │  Cloudflare (DNS + CDN + DDoS Protection)            │    │   │
│  │  │                                                      │    │   │
│  │  │  novastudio.com       → Vercel                       │    │   │
│  │  │  ws.novastudio.com    → VPS (Socket.io)              │    │   │
│  │  │  files.novastudio.com → Cloudflare R2                │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Environnements

### 2.1 Trois Environnements

| Environnement | URL | Base de données | Usage |
|---------------|-----|-----------------|-------|
| **Development** | `localhost:3000` | PostgreSQL local / Docker | Développement local |
| **Staging** | `staging.novastudio.com` | Neon (branche preview) | Tests pré-production |
| **Production** | `novastudio.com` | Neon (branche main) | Production |

### 2.2 Variables d'Environnement par Environnement

```env
# ============================================================
# COMMUN À TOUS LES ENVIRONNEMENTS
# ============================================================

# Application
NEXT_PUBLIC_APP_URL=https://novastudio.com
NEXT_PUBLIC_APP_NAME="Nova Studio"

# ============================================================
# BASE DE DONNÉES
# ============================================================
DATABASE_URL=postgresql://user:password@host:5432/nova_studio
DIRECT_URL=postgresql://user:password@host:5432/nova_studio  # Pour Prisma (sans pooling)

# ============================================================
# AUTHENTIFICATION
# ============================================================
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://novastudio.com

# Discord OAuth (pour login admin/créateur)
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# ============================================================
# DISCORD BOT
# ============================================================
DISCORD_BOT_TOKEN=...
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

# ============================================================
# API INTERNE (communication site ↔ bot)
# ============================================================
INTERNAL_API_KEY=<random-64-char-string>
INTERNAL_API_URL=https://novastudio.com/api/internal

# Bot expose un petit serveur HTTP pour recevoir les commandes du site
BOT_HTTP_PORT=4000
BOT_HTTP_URL=http://localhost:4000  # En prod: http://bot:4000 (Docker network)

# ============================================================
# EMAIL
# ============================================================
RESEND_API_KEY=re_...
EMAIL_FROM="Nova Studio <noreply@novastudio.com>"

# ============================================================
# PAIEMENTS
# ============================================================
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================================
# STOCKAGE FICHIERS
# ============================================================
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=nova-studio-files
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://files.novastudio.com

# ============================================================
# TEMPS RÉEL
# ============================================================
NEXT_PUBLIC_SOCKET_URL=wss://ws.novastudio.com
SOCKET_PORT=3001

# ============================================================
# REDIS
# ============================================================
REDIS_URL=redis://...
# ou Upstash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# ============================================================
# MONITORING
# ============================================================
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

# ============================================================
# CRON (Vercel)
# ============================================================
CRON_SECRET=<random-string>  # Pour sécuriser les endpoints cron
```

---

## 3. Déploiement — Application Web (Vercel)

### 3.1 Configuration Vercel

```json
// vercel.json
{
  "buildCommand": "pnpm turbo build --filter=web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/invoice-overdue",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### 3.2 Build Pipeline

```
1. Push sur main (ou PR merge)
        │
        ▼
2. Vercel détecte le push
        │
        ▼
3. pnpm install (avec cache)
        │
        ▼
4. Turborepo build:
   • packages/shared → build
   • packages/database → prisma generate
   • packages/email-templates → build
   • apps/web → next build
        │
        ▼
5. Déploiement atomique
        │
        ▼
6. Vérifications post-deploy
   • Health check: GET /api/health
   • Prisma migrations si nécessaire
```

### 3.3 Preview Deployments

Chaque PR crée un déploiement preview sur Vercel :
- URL unique : `nova-studio-<hash>.vercel.app`
- Branche de BDD Neon dédiée (si Neon branching activé)
- Variables d'environnement staging

---

## 4. Déploiement — Bot Discord + Socket.io (VPS)

### 4.1 Configuration Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  discord-bot:
    build:
      context: .
      dockerfile: apps/discord-bot/Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}
      - DISCORD_GUILD_ID=${DISCORD_GUILD_ID}
      - INTERNAL_API_KEY=${INTERNAL_API_KEY}
      - INTERNAL_API_URL=${INTERNAL_API_URL}
      - BOT_HTTP_PORT=4000
    ports:
      - "4000:4000"
    networks:
      - nova-network
    depends_on:
      - redis

  socket-server:
    build:
      context: .
      dockerfile: apps/socket-server/Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
      - SOCKET_PORT=3001
      - INTERNAL_API_KEY=${INTERNAL_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    ports:
      - "3001:3001"
    networks:
      - nova-network
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - nova-network

networks:
  nova-network:
    driver: bridge

volumes:
  redis-data:
```

### 4.2 Dockerfiles

```dockerfile
# apps/discord-bot/Dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/discord-bot/package.json ./apps/discord-bot/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
RUN pnpm install --frozen-lockfile --filter=discord-bot...

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/discord-bot/node_modules ./apps/discord-bot/node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm turbo build --filter=discord-bot

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/discord-bot/dist ./dist
COPY --from=builder /app/apps/discord-bot/node_modules ./node_modules
COPY --from=builder /app/packages/database/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/index.js"]
```

### 4.3 Déploiement Automatisé (GitHub Actions)

```yaml
# .github/workflows/deploy-vps.yml
name: Deploy Bot & Socket to VPS

on:
  push:
    branches: [main]
    paths:
      - 'apps/discord-bot/**'
      - 'apps/socket-server/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Discord Bot
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/discord-bot/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/discord-bot:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Socket Server
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/socket-server/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/socket-server:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nova-studio
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f
```

---

## 5. Base de Données

### 5.1 Provider Recommandé : Neon

| Critère | Neon | Supabase | Railway |
|---------|------|----------|---------|
| **Serverless** | ✅ Auto-scale | ⚠️ Always-on | ⚠️ Always-on |
| **Branching** | ✅ Natif | ❌ | ❌ |
| **Cold starts** | ⚠️ ~500ms | ✅ Aucun | ✅ Aucun |
| **Free tier** | ✅ Généreux | ✅ Généreux | ⚠️ Limité |
| **Prix prod** | ~$19/mois | ~$25/mois | ~$20/mois |
| **Prisma compat.** | ✅ | ✅ | ✅ |

**Choix : Neon** pour le branching (preview databases par PR) et le serverless.

### 5.2 Migrations

```bash
# Développement : push direct
pnpm prisma db push

# Production : migrations versionnées
pnpm prisma migrate dev --name <nom_migration>  # Créer une migration
pnpm prisma migrate deploy                       # Appliquer en production
```

### 5.3 Backups

- **Neon** : Backups automatiques (point-in-time recovery)
- **Complément** : Export quotidien via cron GitHub Actions → stockage R2

```yaml
# .github/workflows/db-backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 3 * * *'  # 3h du matin chaque jour

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: |
          pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

      - name: Upload to R2
        uses: jakejarvis/s3-sync-action@v0.5.1
        with:
          args: --endpoint-url $R2_ENDPOINT
        env:
          AWS_S3_BUCKET: nova-studio-backups
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          SOURCE_DIR: ./
```

---

## 6. Monitoring & Observabilité

### 6.1 Stack de Monitoring

| Outil | Usage | Coût |
|-------|-------|------|
| **Sentry** | Error tracking, performance | Free tier (5K events/mois) |
| **Vercel Analytics** | Web vitals, trafic | Inclus avec Vercel |
| **Uptime Robot** | Monitoring uptime | Free (50 monitors) |
| **Grafana Cloud** | Dashboards VPS (CPU, RAM) | Free tier |
| **Discord Logs** | Logs du bot dans `#bot-logs` | Gratuit |

### 6.2 Health Checks

```typescript
// apps/web/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    discord: await checkDiscordBot(),
    stripe: await checkStripe(),
    timestamp: new Date().toISOString(),
  };

  const allHealthy = Object.values(checks).every(
    (v) => v === true || typeof v === 'string'
  );

  return Response.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}
```

### 6.3 Alertes

| Alerte | Canal | Condition |
|--------|-------|-----------|
| Site down | Discord `#alerts` + Email | Uptime Robot — down > 1 min |
| Bot Discord offline | Discord `#alerts` | Heartbeat manqué > 5 min |
| Erreur 500 (spike) | Sentry → Discord | > 10 erreurs/minute |
| DB connections élevées | Grafana → Discord | > 80% pool utilisé |
| Facture impayée > 7j | Email admin | Cron quotidien |

---

## 7. Sécurité

### 7.1 Checklist de Sécurité

- [ ] **HTTPS** partout (Cloudflare SSL)
- [ ] **Headers de sécurité** (CSP, HSTS, X-Frame-Options) via `next.config.js`
- [ ] **Rate limiting** sur les API publiques (Upstash Ratelimit)
- [ ] **CSRF protection** (Next.js built-in + tokens)
- [ ] **Input validation** (Zod sur toutes les entrées)
- [ ] **SQL injection** (impossible avec Prisma parameterized queries)
- [ ] **XSS** (React échappe par défaut + CSP strict)
- [ ] **Auth tokens** (HttpOnly cookies, SameSite=Strict)
- [ ] **API keys** stockées en variables d'environnement (jamais dans le code)
- [ ] **CORS** configuré strictement (uniquement les domaines autorisés)
- [ ] **File upload** : validation MIME type + taille max + scan antivirus optionnel
- [ ] **Discord bot permissions** : principe du moindre privilège
- [ ] **Webhook verification** : signature Stripe + clé API interne
- [ ] **Dependency scanning** : Dependabot / Snyk activé

### 7.2 Configuration Next.js (Headers)

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

---

## 8. CI/CD Pipeline Complet

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: nova_studio_test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm prisma db push
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/nova_studio_test
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/nova_studio_test

  e2e:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpx playwright install --with-deps
      - run: pnpm build --filter=web
      - run: pnpm test:e2e
```

---

## 9. Estimation des Coûts (Production)

### 9.1 Coûts Mensuels Estimés

| Service | Plan | Coût/mois |
|---------|------|-----------|
| **Vercel** | Pro | 20€ |
| **Neon** | Launch | 19€ |
| **Hetzner VPS** | CX22 (2 vCPU, 4GB RAM) | 5€ |
| **Cloudflare** | Free (DNS + CDN + R2) | 0€ |
| **Cloudflare R2** | Pay-as-you-go | ~2€ |
| **Upstash Redis** | Pay-as-you-go | ~3€ |
| **Resend** | Free (3K emails/mois) ou Pro | 0-20€ |
| **Stripe** | Pay-as-you-go (2.9% + 0.30€) | Variable |
| **Sentry** | Free tier | 0€ |
| **Uptime Robot** | Free | 0€ |
| **Domaine** | novastudio.com | ~1€/mois |
| **GitHub** | Free (repos privés) | 0€ |

**Total estimé : ~50-70€/mois** (hors frais Stripe sur les transactions)

### 9.2 Scaling Futur

| Seuil | Action | Coût additionnel |
|-------|--------|-----------------|
| > 10K visites/mois | Rester sur Vercel Pro | Inclus |
| > 100 projets/mois | Upgrade Neon Scale | +30€ |
| > 50K emails/mois | Upgrade Resend | +20€ |
| Bot Discord instable | Upgrade VPS CX32 | +5€ |
| Multi-serveurs Discord | Architecture multi-guild | Dev time |

---

## 10. Checklist de Lancement

### 10.1 Pré-Lancement

- [ ] Domaine `novastudio.com` acheté et configuré sur Cloudflare
- [ ] Certificat SSL actif (Cloudflare)
- [ ] Base de données PostgreSQL provisionnée (Neon)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Bot Discord créé sur le Developer Portal
- [ ] Serveur Discord structuré (catégories, salons, rôles)
- [ ] Bot invité sur le serveur avec les bonnes permissions
- [ ] Compte Stripe configuré (mode live)
- [ ] Webhooks Stripe configurés
- [ ] Domaine vérifié sur Resend
- [ ] VPS provisionné et Docker installé
- [ ] CI/CD GitHub Actions fonctionnel

### 10.2 Tests Pré-Lancement

- [ ] Formulaire "Rejoindre" → ticket créé sur site + Discord
- [ ] Formulaire "Service" → ticket créé + créateurs pingés
- [ ] Vérification email fonctionnelle
- [ ] Code de discussion → accès chat OK
- [ ] Chat temps réel (site ↔ Discord)
- [ ] Assignation créateur (Discord bouton + admin dashboard)
- [ ] Création de projet depuis un ticket
- [ ] Facturation Stripe → paiement → webhook
- [ ] Notifications email envoyées
- [ ] Dashboard admin responsive (mobile + desktop)
- [ ] Pages vitrine SEO validées (Lighthouse > 90)
- [ ] Rate limiting fonctionnel

### 10.3 Post-Lancement

- [ ] Monitoring Sentry activé
- [ ] Uptime Robot configuré
- [ ] Backups DB quotidiens vérifiés
- [ ] Analytics Vercel activé
- [ ] Feedback channel Discord pour les bugs
- [ ] Documentation utilisateur (pour les admins/créateurs)
