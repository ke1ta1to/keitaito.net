# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm monorepo for a portfolio site: Next.js frontend (`www/`), Go AWS Lambda backend (`functions/`), AWS CDK infrastructure (`infra/`).

## Commands

### www (Next.js 16, App Router)
```bash
pnpm --filter www dev          # Dev server
pnpm --filter www build        # Production build
pnpm --filter www lint         # ESLint
pnpm --filter www typecheck    # TypeScript type check
pnpm --filter www storybook    # Storybook dev server
pnpm --filter www build-schema # Generate TS types from OpenAPI YAML
```

### functions (Go Lambda)
```bash
cd functions
make all       # Build all Lambda functions (Linux ARM64)
make test      # Run all Go tests (go test -v ./...)
make generate  # Generate mocks (mockgen via go generate)
make seed      # Seed DynamoDB data
make clean     # Remove build artifacts
```

### infra (AWS CDK)
```bash
pnpm --filter infra build        # Compile TypeScript
pnpm --filter infra test         # Run Jest tests
pnpm --filter infra cdk:deploy   # Deploy to dev (hotswap)
```

## Architecture

### Frontend (www/)
- **Next.js 16** with App Router, React 19, Tailwind CSS 4, shadcn/ui
- **Path alias**: `@/*` → `./src/*`
- **Routing**: `src/app/(user)/` for public pages (Server Components), `src/app/admin/` for admin SPA (Client Components with React Router HashRouter)
- **API client**: `openapi-fetch` with auto-generated types from `src/schema.ts` (generated via `openapi-typescript`). Server-side client in `src/lib/api-server.ts` auto-attaches Cognito Client Credentials tokens
- **Auth**: Public pages use Cognito Client Credentials (server-side). Admin uses Cognito OAuth2 Authorization Code flow via AWS Amplify v6
- **State**: TanStack React Query, react-hook-form + zod v4
- **Structure**: `src/features/` for feature modules (landing-page, admin), `src/components/ui/` for shadcn components

### Backend (functions/)
- **One Lambda per API endpoint** (e.g., `cmd/activities_list/`, `cmd/skills_list/`)
- **Layered pattern**: Repository (DynamoDB) → Service (business logic) → Handler (API Gateway integration)
- **API spec**: `openapi/openapi.yaml` (OpenAPI 3.0.4) — Go types are hand-written, not auto-generated
- **Mocks**: `go generate ./...` runs mockgen for repository/service interfaces
- **EventBridge**: Scheduled rules for article collection (`articles_collector`, `articles_collect`)

### Infrastructure (infra/)
- **AWS CDK v2** with single stack (`portfolio-stack.ts`)
- **Resources**: API Gateway, Cognito User Pool, DynamoDB, Lambda, S3, EventBridge
- **Environments**: `dev`/`prod` via CDK context (`-c env=dev`)

### OpenAPI-Driven Development
The OpenAPI spec (`functions/openapi/openapi.yaml`) is the source of truth for the API contract:
1. TypeScript client types: `pnpm --filter www build-schema` (openapi-typescript → `www/src/schema.ts`)
2. API linting: Redocly CLI (`pnpm --filter functions lint`)
3. Go types are hand-written — not generated from OpenAPI

### API Proxy
`next.config.ts` rewrites `/api/*` to `${NEXT_PUBLIC_API_BASE_URL}/*`.

## Code Style
- TypeScript: ESLint flat config (`eslint.config.mjs`), no Prettier
- Go: Standard Go formatting
- `src/schema.ts` is auto-generated — do not edit manually
- Commit messages: conventional style (feat/fix/refactor prefix), Japanese is acceptable in messages
