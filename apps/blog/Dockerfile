# syntax=docker/dockerfile:1

FROM node:24-slim AS base
# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

FROM base AS builder
ARG SITE_URL
ENV SITE_URL=$SITE_URL

COPY --from=deps /pnpm /pnpm
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile --offline

WORKDIR /app/apps/blog
RUN pnpm build

FROM node:24-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/blog/public ./public
RUN mkdir -p .next
COPY --from=builder --chown=nextjs:nodejs /app/apps/blog/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/blog/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "apps/blog/server.js"]
