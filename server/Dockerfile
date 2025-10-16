# base
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# openssl
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  openssl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F server exec prisma generate
RUN pnpm -F server build
RUN pnpm deploy -F server --prod /prod

FROM base AS prod
WORKDIR /prod
COPY --from=build /prod .
CMD ["node", "/prod/dist/main.js"]
