# syntax=docker/dockerfile:1

FROM node:24-slim AS base

WORKDIR /repo

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

FROM base AS builder

WORKDIR /repo

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install -r --offline --frozen-lockfile

ENV NODE_ENV=production

RUN pnpm -F blog build

FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=node:node /repo/apps/blog/public ./public
COPY --from=builder --chown=node:node /repo/apps/blog/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/blog/.next/static ./.next/static

USER node
EXPOSE 3000

CMD ["node", "apps/blog/server.js"]
