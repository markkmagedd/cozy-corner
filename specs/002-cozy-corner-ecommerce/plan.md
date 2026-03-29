# Implementation Plan: Cozy Corner E-Commerce Platform

**Branch**: `002-cozy-corner-ecommerce` | **Date**: 2026-03-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-cozy-corner-ecommerce/spec.md`

## Summary

Build a full-stack Next.js e-commerce storefront for a clothing and equipment shop called "cozy-corner". The platform enables visitors to browse products by category via mega-menu navigation, filter/sort/search products, view product details with color/size variant selection, and explore related products. An admin dashboard with Supabase Auth provides full CRUD management for products, categories, and product images. The backend uses Prisma ORM with Supabase PostgreSQL for data, Supabase Storage for image hosting, and Next.js API Routes for REST endpoints. There is no cart or checkout functionality.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+  
**Framework**: Next.js 15 (App Router)  
**Primary Dependencies**: Prisma ORM, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Tailwind CSS v4, React Hook Form, Zod, `@dnd-kit/core`, `@dnd-kit/sortable`  
**Storage**: Supabase PostgreSQL (via Prisma) + Supabase Storage (images)  
**Testing**: Manual testing for MVP (no automated test framework specified)  
**Target Platform**: Web (modern browsers: Chrome, Firefox, Safari, Edge — latest 2 versions)  
**Project Type**: Full-stack web application  
**Performance Goals**: Category page <2s load, filter/sort <1s update, search <1s results  
**Constraints**: Max 5 MB image uploads (JPEG/PNG/WebP), no cart/checkout, single admin role  
**Scale/Scope**: <10,000 products initially, single language (English), single currency

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No active constitution configured for this project. All gates pass by default. Proceeding with standard best practices:
- ✅ Clean code structure with separation of concerns
- ✅ TypeScript for type safety
- ✅ Error handling and loading states throughout
- ✅ Responsive design
- ✅ Security (authenticated admin routes)

## Project Structure

### Documentation (this feature)

```text
specs/002-cozy-corner-ecommerce/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   └── api.md           # Phase 1: REST API contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2: Task breakdown (via /speckit.tasks)
```

### Source Code (repository root)

```text
cozy-corner-new/
├── prisma/
│   ├── schema.prisma              # Database schema (4 models)
│   └── seed.ts                    # Development seed data
├── src/
│   ├── app/
│   │   ├── (storefront)/          # Public-facing pages
│   │   │   ├── page.tsx           # Homepage (hero + featured)
│   │   │   ├── category/[slug]/   # Category listing with filters
│   │   │   └── product/[slug]/    # Product detail with variants
│   │   ├── admin/                 # Auth-protected admin dashboard
│   │   │   ├── login/             # Admin login page
│   │   │   ├── products/          # Product CRUD pages
│   │   │   ├── categories/        # Category CRUD page
│   │   │   ├── layout.tsx         # Admin shell (sidebar nav)
│   │   │   └── page.tsx           # Dashboard overview
│   │   ├── api/                   # REST API route handlers
│   │   │   ├── products/          # Public product endpoints
│   │   │   ├── categories/        # Public category endpoint
│   │   │   ├── search/            # Full-text search endpoint
│   │   │   ├── admin/             # Auth-protected CRUD endpoints
│   │   │   └── auth/              # Login/logout endpoints
│   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   └── globals.css            # Tailwind + design tokens
│   ├── components/
│   │   ├── storefront/            # 12 storefront components
│   │   ├── admin/                 # 7 admin components
│   │   └── ui/                    # 6 shared UI primitives
│   ├── lib/
│   │   ├── prisma.ts              # Prisma singleton
│   │   ├── supabase/              # Supabase client configs
│   │   ├── utils.ts               # Slugify, formatPrice, etc.
│   │   └── validations.ts         # Zod schemas (shared)
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── middleware.ts                   # Auth guard for /admin routes
├── .env.local                     # Environment variables
├── .env.example                   # Env template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**Structure Decision**: Single Next.js project with App Router route groups to separate storefront `(storefront)` from admin `admin/`. API routes are collocated under `app/api/`. This is the standard Next.js full-stack pattern — no separate backend project needed. Components are organized by domain (storefront/admin/ui) for clear ownership.

## Phase Design Decisions

### Rendering Strategy
- **Storefront pages**: Server Components (SSR) for SEO and performance. Category/product pages use dynamic server rendering with search params for filters.
- **Admin pages**: Client Components where needed (forms, drag-drop, interactive tables). Admin layout is server-rendered shell with client interactive areas.
- **API routes**: Server-only Route Handlers.

### Authentication Flow
1. Admin navigates to `/admin/login`
2. Submits email/password → POST `/api/auth/login`
3. Server calls `supabase.auth.signInWithPassword()`, sets session cookie
4. `middleware.ts` checks session on all `/admin/*` routes (except `/admin/login`)
5. Unauthorized requests redirect to `/admin/login`

### Image Upload Flow
1. Admin selects files in `ImageUploader` component
2. Client-side validation: file type (JPEG/PNG/WebP), size (≤5 MB)
3. POST `/api/admin/products/[id]/images` with `multipart/form-data`
4. Server uploads to Supabase Storage `product-images` bucket
5. Creates `ProductImage` record with public URL and storage path
6. Returns image metadata to client

### Search Architecture
- PostgreSQL full-text search using `tsvector` column on Product (name + description)
- GIN index for fast lookups
- Prisma raw query for `ts_query` matching
- Storefront search bar uses debounced input (300ms) → GET `/api/search?q=...`

### Filter/Sort State Management
- URL search params encode filter/sort state (`?brand=Nike&minPrice=50&sort=price_asc&page=2`)
- Server Component reads params and queries database
- Client-side filter UI updates URL params via `useRouter().push()`
- Shareable, bookmarkable URLs

## Complexity Tracking

No constitution violations to justify.

## Artifacts Reference

| Artifact | Path | Description |
|----------|------|-------------|
| Research | [research.md](./research.md) | Technology decisions and alternatives |
| Data Model | [data-model.md](./data-model.md) | Entity definitions, relationships, indexes |
| API Contracts | [contracts/api.md](./contracts/api.md) | REST endpoint specifications |
| Quickstart | [quickstart.md](./quickstart.md) | Setup guide and project structure |
