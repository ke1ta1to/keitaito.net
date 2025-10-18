# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F server exec prisma generate
RUN pnpm -F server build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy -F server --prod /prod

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /prod .
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs
EXPOSE 3010
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"
CMD ["node", "dist/main.js"]
