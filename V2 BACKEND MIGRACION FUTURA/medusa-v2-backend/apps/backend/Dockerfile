FROM node:20-alpine AS base

# ── Dependencies ──────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./
COPY apps/backend/package.json ./apps/backend/

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile --filter=@dtc/backend

# ── Builder ───────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm --filter=@dtc/backend build

# ── Runner ────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache tini
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa

COPY --from=builder --chown=medusa:nodejs /app/apps/backend/.medusa ./apps/backend/.medusa
COPY --from=builder --chown=medusa:nodejs /app/apps/backend/package.json ./apps/backend/
COPY --from=builder --chown=medusa:nodejs /app/apps/backend/medusa-config.ts ./apps/backend/
COPY --from=builder --chown=medusa:nodejs /app/apps/backend/medusa-config.js ./apps/backend/ 2>/dev/null || true
COPY --from=builder --chown=medusa:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=medusa:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder --chown=medusa:nodejs /app/package.json /app/pnpm-workspace.yaml /app/.npmrc ./

USER medusa
EXPOSE 9000

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "cd apps/backend && npx medusa db:migrate && npx medusa start"]
