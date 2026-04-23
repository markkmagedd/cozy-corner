# Implementation Plan: Skeleton Loading States

**Branch**: `018-skeleton-loading` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/018-skeleton-loading/spec.md`

## Summary

Add skeleton loading states to the 8 pages in the application that currently display a blank screen during server-side data fetching. Each page gets a `loading.tsx` file that renders layout-matched skeleton placeholders using the existing `Skeleton` UI component. No database changes, no API changes, no modifications to existing files.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19, Tailwind CSS 4  
**Storage**: N/A (no data model changes)  
**Testing**: Manual visual testing + Chrome DevTools CLS measurement  
**Target Platform**: Web (server-rendered)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Skeleton appears within 100ms of navigation; CLS < 0.05  
**Constraints**: Must reuse existing `Skeleton` component; must match existing loading patterns  
**Scale/Scope**: 8 new files, 0 modified files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is a blank template — no project-specific gates defined. No violations possible. **PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/018-skeleton-loading/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output — technical decisions
├── data-model.md        # Phase 1 output — no new entities
├── quickstart.md        # Phase 1 output — developer guide
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── loading.tsx                              # NEW — Homepage skeleton
│   ├── categories/
│   │   └── loading.tsx                          # NEW — Categories page skeleton
│   ├── category/
│   │   └── [slug]/
│   │       └── loading.tsx                      # NEW — Category detail skeleton
│   ├── admin/
│   │   ├── loading.tsx                          # NEW — Admin dashboard skeleton
│   │   ├── products/
│   │   │   ├── new/
│   │   │   │   └── loading.tsx                  # NEW — New product form skeleton
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── loading.tsx              # NEW — Edit product form skeleton
│   │   └── categories/
│   │       ├── new/
│   │       │   └── loading.tsx                  # NEW — New category form skeleton
│   │       └── [id]/
│   │           └── edit/
│   │               └── loading.tsx              # NEW — Edit category form skeleton
└── components/
    └── ui/
        └── Skeleton.tsx                         # EXISTING — reused, not modified
```

**Structure Decision**: All 8 new files are `loading.tsx` convention files placed alongside existing `page.tsx` files in their respective route directories. No new directories are created — all parent directories already exist.

## Architecture

### How It Works

```
┌────────────────────────────────────┐
│ Next.js App Router                 │
│                                    │
│  User navigates to /category/shoes │
│                                    │
│  1. Router finds loading.tsx       │
│  2. Wraps page.tsx in <Suspense>   │
│  3. Shows loading.tsx immediately  │
│  4. page.tsx fetches data (async)  │
│  5. Swaps loading → page content   │
└────────────────────────────────────┘
```

### Key Design Decisions

1. **Convention over configuration**: Using `loading.tsx` files (Next.js convention) instead of manual Suspense boundaries — matches the 3 existing loading files in the project.

2. **Storefront skeletons include Navbar/Footer**: Storefront `loading.tsx` files render the real `<Navbar />` and `<Footer />` components so the user sees instant chrome. Only the content area is skeleton. This matches the existing `/product/[slug]/loading.tsx` pattern.

3. **Admin skeletons are content-only**: The admin layout (`/admin/layout.tsx`) already renders the sidebar. Admin `loading.tsx` files only need to render the content area skeleton. This matches the existing `/admin/categories/loading.tsx` and `/admin/products/loading.tsx` patterns.

4. **Reuse existing Skeleton component**: All skeletons use `<Skeleton className="..." />` from `src/components/ui/Skeleton.tsx` for visual consistency.

5. **Layout-matched shapes**: Each skeleton mirrors the real page's grid structure (columns, card proportions, form fields) to minimize CLS.

### Skeleton Templates by Page Type

**Product Grid Skeleton** (used by homepage):
- 4 columns on desktop, responsive down to 1
- Each card: square aspect ratio image + 2 text lines

**Partial Category Skeleton** (used by category detail):
- **Static Header**: Category title, description, and subcategory navigation remain visible.
- **Skeleton Content**: Only the filter sidebar and product grid are wrapped in `<Suspense>` with a fallback skeleton.
- Matches existing card proportions and grid structure.

**Category Card Skeleton** (used by categories page):
- 3 columns on desktop
- Each card: 4:3 aspect ratio image + text

**Admin Form Skeleton** (used by new/edit pages):
- Page header (title + subtitle)
- Form fields: full-width inputs, dropdowns, textareas

**Admin Dashboard Skeleton** (used by admin root):
- 4 stat cards in a row, each with icon placeholder + text

## Complexity Tracking

No constitution violations to justify — no complexity tracking needed.
