# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache libc6-compat && \
    rm -rf /var/cache/apk/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json server/
COPY www/package.json www/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm -F www build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/www/public ./www/public
COPY --from=builder --chown=nextjs:nodejs /app/www/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/www/.next/static ./www/.next/static
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "www/server.js"]
