# syntax=docker/dockerfile:1.7

FROM node:24.14.1-slim AS base

WORKDIR /repo

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

FROM base AS builder

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install -r --offline --frozen-lockfile

ENV NODE_ENV=production

RUN pnpm -F blog build

FROM node:24.14.1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=node:node /repo/apps/blog/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=builder --chown=node:node /repo/apps/blog/public ./apps/blog/public

RUN mkdir -p ./apps/blog/.next/cache && chown node:node -R node:node ./apps/blog/.next

USER node
EXPOSE 3000

CMD ["node", "apps/blog/server.js"]
