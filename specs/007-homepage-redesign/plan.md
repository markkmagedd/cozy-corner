# Implementation Plan: Homepage Redesign

**Branch**: `007-homepage-redesign` | **Date**: 2026-03-30 | **Spec**: [specs/007-homepage-redesign/spec.md](spec.md)
**Input**: Feature specification from `/specs/007-homepage-redesign/spec.md`

## Summary

Redesign the homepage to remove the filter sidebar from the New Arrivals section, making the product grid full-width, and add three new content sections below: Featured Categories (data-driven), Promotional Banner (static content), and Newsletter Signup (client-side only). The existing Category model already supports `isFeatured` and `displayOrder` fields — no schema migration required.

## Technical Context

**Language/Version**: TypeScript, React 19, Next.js 16.2.1  
**Primary Dependencies**: TailwindCSS, Prisma, lucide-react  
**Storage**: PostgreSQL via Supabase (existing)  
**Testing**: Manual Visual Testing  
**Target Platform**: Web Browsers (Mobile, Tablet, Desktop)  
**Project Type**: Next.js Web App (App Router, Server Components)  
**Performance Goals**: Zero regression on current page load time  
**Constraints**: Newsletter is client-side only (no backend email integration); promo banner uses static content  
**Scale/Scope**: 1 page modified, 3 new components created, 0 schema changes  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution violations. The constitution is in template/placeholder state and does not impose constraints. The changes use the existing design system (Tailwind), existing data model (Category.isFeatured), and follow Next.js App Router conventions.

## Project Structure

### Documentation (this feature)

```text
specs/007-homepage-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── page.tsx                              # Modified: remove FilterSidebar, add new sections, fetch categories
└── components/
    └── storefront/
        ├── FeaturedCategories.tsx             # NEW: data-driven category cards grid
        ├── PromoBanner.tsx                    # NEW: static promotional banner with CTA
        ├── NewsletterSignup.tsx               # NEW: client component with email form
        ├── FilterSidebar.tsx                  # UNCHANGED: still used on other pages
        ├── HeroSection.tsx                    # UNCHANGED
        ├── ProductGrid.tsx                    # UNCHANGED
        ├── Pagination.tsx                     # UNCHANGED
        └── ...
```

**Structure Decision**: Three new components are created inside the existing `src/components/storefront/` directory, following the established project pattern. The main `page.tsx` is modified to remove the FilterSidebar import/usage and add the new section components. No new directories or architectural patterns are introduced.

## Complexity Tracking

N/A — No constitution violations to justify.
