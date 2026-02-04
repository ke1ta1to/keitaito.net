# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (keitaito.net). Monorepo with three packages managed by pnpm workspaces.

## Tech Stack

- **www**: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **functions**: Go Lambda functions, DynamoDB, OpenAPI-driven
- **infra**: AWS CDK (TypeScript), API Gateway, Cognito, DynamoDB

## Commands

### Frontend (www/)

```bash
pnpm --filter @repo/www dev          # Dev server
pnpm --filter @repo/www build        # Build (static export)
pnpm --filter @repo/www lint         # ESLint
pnpm --filter @repo/www typecheck    # TypeScript check
pnpm --filter @repo/www orval        # Regenerate API client from OpenAPI spec
pnpm --filter @repo/www storybook    # Storybook dev server (port 6006)
```

### Backend (functions/)

```bash
cd functions && make all              # Build all Lambda functions (linux/arm64)
cd functions && make test             # Run Go tests
cd functions && make <function_name>  # Build single function (e.g., make activities_list)
pnpm --filter @repo/functions lint    # Lint OpenAPI spec with Redocly
```

### Infrastructure (infra/)

```bash
pnpm --filter @repo/infra test        # Run CDK tests (Jest)
pnpm --filter @repo/infra cdk:deploy  # Deploy to dev environment
```

## Architecture

### OpenAPI-Driven Development

The API contract lives in `functions/openapi/openapi.yaml`. This is the single source of truth:

- Backend: Go Lambda handlers implement the spec
- Frontend: Orval generates typed API clients from the spec into `www/src/orval/`
  - `orval/client/` — browser-side (React Query + Axios)
  - `orval/server/` — server-side (Axios functions with custom mutator)

After changing the OpenAPI spec, run `pnpm --filter @repo/www orval` to regenerate clients.

### Frontend Structure (www/src/)

- `app/` — Next.js App Router. Route groups: `(user)` for public pages, `admin` for admin
- `features/` — Feature-based modules (e.g., `landing-page/`, `admin/`)
- `components/ui/` — shadcn/ui components (do not edit directly; managed by shadcn CLI)
- `components/layouts/` — Layout components (Header)
- `lib/` — Utilities and auth (Cognito client credentials flow)
- `orval/` — Auto-generated API clients (do not edit manually)

Static export is enabled (`output: "export"` in next.config.ts). API calls are rewritten to `NEXT_PUBLIC_API_BASE_URL` via Next.js rewrites.

Server components fetch data via the server-side Orval client with Cognito client credentials auth. Client components use React Query hooks from the client-side Orval client.

### Backend Structure (functions/)

Each Lambda function follows:

- `cmd/<function_name>/main.go` — Entrypoint, wires dependencies
- `internal/<domain>/handler/` — HTTP handler
- `internal/<domain>/service.go` — Business logic interface + implementation
- `internal/<domain>/repository.go` — DynamoDB repository interface + implementation

Three domains: `activities`, `skills`, `profile`. Common AWS utilities in `internal/awsapigw/` and `internal/awsdynamodb/`.

### Infrastructure (infra/)

Single CDK stack (`lib/portfolio-stack.ts`) provisions: API Gateway, Cognito (User Pool + OAuth scopes), Lambda functions (12), DynamoDB tables (3).

## Conventions

- Package manager: pnpm 10.27.0 (do not use npm or yarn)
- Path alias: `@/*` maps to `www/src/*`
- Styling: Tailwind CSS v4 with OKLch color space, dark mode via `.dark` class
- Form validation: Zod schemas with React Hook Form
- Commit messages: Japanese is acceptable (see git log for style)
