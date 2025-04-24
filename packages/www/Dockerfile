# syntax=docker/dockerfile:1

FROM node:23-slim AS builder
WORKDIR /app

COPY . .
RUN npm ci
RUN cd packages/www && npm run build

FROM node:23-slim AS runner
WORKDIR /app

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000 NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/www/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/packages/www/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages/www/.next/standalone/packages/www ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/www/.next/static ./.next/static

RUN ln -s /tmp/cache ./.next/cache

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
