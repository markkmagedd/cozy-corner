# Implementation Plan: Fix Nested Category Products Display

**Branch**: `014-fix-category-products` | **Date**: 2026-04-13 | **Spec**: [specs/014-fix-category-products/spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-fix-category-products/spec.md`

## Summary

The feature ensures that navigating to a main category page (e.g., "Men") displays a combined grid of products from all of its descendant subcategories, resolving the "empty page" issue. It also adds a navigation filter on the category page allowing users to route to specific subcategory URLs. The technical approach involves resolving the category's descendant tree in-memory and then querying products using a `categoryId IN (...)` clause to retain Prisma's type-safety.

## Technical Context

**Language/Version**: TypeScript
**Primary Dependencies**: Next.js (App Router), Prisma, TailwindCSS  
**Storage**: PostgreSQL
**Testing**: N/A
**Target Platform**: Web Browser / Vercel
**Project Type**: Next.js Web Application
**Performance Goals**: < 1 second loading/response time for subcategory navigation. 
**Constraints**: Complex recursive `parentId` fetching since Prisma doesn't natively support recursive arbitrary depth in its query builder.
**Scale/Scope**: E-commerce category display.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

All checks passed. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/014-fix-category-products/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created in next phase)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── categories/
│       └── [slug]/
│           └── page.tsx        
├── components/
│   └── storefront/
│       └── CategoryFilter.tsx
└── lib/
    ├── helpers/
    │   └── category-helpers.ts 
    └── prisma.ts
```

**Structure Decision**: Standard Next.js App Router structure. We will enhance the existing directory fetching logic.

## Complexity Tracking

No constitution violations detected. Complexity is justified for e-commerce recursive hierarchy needs.
