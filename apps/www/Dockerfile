# syntax=docker.io/docker/dockerfile:1

FROM node:22-slim AS base

RUN apt-get update -y \
  && apt-get install -y openssl --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

ARG CUSTOM_URL

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/www/package.json ./apps/www/
COPY packages/db/package.json ./packages/db/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm -F db generate && pnpm -F www build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/www/public ./apps/www/public

COPY --from=builder --chown=nextjs:nodejs /app/apps/www/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/www/.next/static ./apps/www/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/www/server.js"]
