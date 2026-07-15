# ---- Base ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps

COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/validators/package.json ./packages/validators/package.json

RUN npm ci --ignore-scripts

COPY packages/database/prisma ./packages/database/prisma
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# ---- Build ----
FROM deps AS builder

COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN npx turbo run build --filter=api

# ---- Production ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DOTENV_PATH=/app/.env

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/validators/dist ./packages/validators/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/validators/package.json ./packages/validators/package.json

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api || exit 1

CMD ["node", "dist/main.js"]
