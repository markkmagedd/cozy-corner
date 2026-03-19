# Implementation Plan: Admin Panel Backend

**Branch**: `005-admin-panel-backend` | **Date**: 2026-03-19 | **Spec**: [spec.md](file:///f:/Coding/cozy-corner/specs/005-admin-panel-backend/spec.md)
**Input**: Feature specification from `/specs/005-admin-panel-backend/spec.md`

## Summary

Implement a secure administrative dashboard using **Supabase** for backend services (Auth, Database, Storage) integrated into the existing **Next.js 15 App Router** project. The plan covers full CRUD for Products and Categories with automated slug generation, secure image uploads, and Row Level Security (RLS) to ensure the storefront remains a public-read-only catalog.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: `prisma`, `@prisma/client`, `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `framer-motion`
**Storage**: Supabase (PostgreSQL, GoTrue Auth, Storage Buckets)
**Testing**: Vitest / Playwright (Recommended for dashboard flows)
**Target Platform**: Web (Responsive Desktop/Mobile)
**Project Type**: Next.js Web Application (Storefront + Admin Dashboard)
**Performance Goals**: < 3s image upload; < 200ms API response for catalog reads
**Constraints**: Row Level Security (RLS) for public read/admin write; 5MB image limit
**Scale/Scope**: ~100-500 products; multi-level category hierarchy

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| Component-First Architecture | ✅ PASS | Dashboard will use modular Radix/Tailwind components. |
| Responsive Design | ✅ PASS | Admin panel will be fully responsive for mobile management. |
| Static Typing | ✅ PASS | Supabase type generation and strict TS throughout. |
| Declarative State | ✅ PASS | Leveraging Next.js Server Actions for all mutations. |
| Premium Aesthetics | ✅ PASS | Dashboard will follow the project's high-end "Hotel Shop" aesthetic. |

## Project Structure

### Documentation (this feature)

```text
specs/005-admin-panel-backend/
├── plan.md              # This file
├── research.md          # Prisma + Supabase patterns
├── prisma-schema.md     # Prisma Schema definition
├── quickstart.md        # Setup guide for Prisma & Supabase
├── contracts/           # Admin UI prop types
└── tasks.md             # Task breakdown (Refactored for Prisma)
```

### Source Code

```text
├── prisma/
│   └── schema.prisma    # Single source of truth for schema
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   └── (admin)/
│   ├── lib/
│   │   ├── prisma.ts    # Prisma Client singleton
│   │   ├── supabase/    # Auth & Storage only
│   │   └── utils/
│   └── types/
│       └── database.ts  # Prisma generated types
```

**Structure Decision**: Using Next.js Route Groups `(store)` and `(admin)` to separate the public catalog from the private dashboard while sharing the core UI system.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Client-Side Image Upload | UX responsiveness | Server Actions have body limits and can be slower for large binary transfers than direct signed uploads. |
| Dynamic Slug Generation | SEO/UX consistency | Static IDs are easier but create unprofessional URLs. |
