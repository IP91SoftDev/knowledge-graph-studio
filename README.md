# Knowledge Graph Studio

Internal knowledge base management tool with AI-powered categorization and enrichment.

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment
cp .env.example .env.local

# Run Supabase migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed

# Start development
pnpm dev
```

## Project Structure

```
knowledge-graph-studio/
├── apps/
│   └── web/              # Next.js 14+ dashboard
├── packages/
│   ├── ai/               # AI abstraction (RouteLLM, schemas)
│   ├── database/         # Supabase client + types
│   ├── ui/               # Shared UI components
│   └── validation/       # Zod schemas
├── infra/
│   └── supabase/
│       └── migrations/   # Database migrations
└── docs/                 # Project documentation
```

## Documentation

- [Intake Charter](./docs/intake.md)
- [Database Schema](./docs/schema.md)
- [Ingestion Pipeline](./docs/ingestion-pipeline.md)
- [UI Sitemap](./docs/ui-sitemap.md)
- [AI Re-run Policy](./docs/ai-rerun-policy.md)

## AI Model Policy

Per firm policy (DOCUMENTATION.md §6):

| Task | Model |
|------|-------|
| Categorization | qwen3.5-plus |
| Fallback | Manual review |

## Daily AI Budget

- Limit: $5.00/day
- Estimated cost: $0.005/resource
- Capacity: ~1000 resources/day

## Auth

- Supabase Auth (magic link)
- Single admin user (v1)
- RLS enforced on all tables

## Deployment

- Web: Vercel
- Database: Supabase
- AI: RouteLLM abstraction
