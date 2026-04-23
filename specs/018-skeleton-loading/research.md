# Research: Skeleton Loading States

**Feature**: 018-skeleton-loading  
**Date**: 2026-04-23

## R1: Loading State Mechanism

**Decision**: Use Next.js App Router `loading.tsx` convention files — one per route segment.

**Rationale**: The project already uses this pattern successfully for 3 routes (`/admin/categories`, `/admin/products`, `/product/[slug]`). Next.js automatically wraps the page in a React Suspense boundary and displays the `loading.tsx` export during server-side data fetching. This is the idiomatic approach for Next.js 16, requires zero client-side code, and works for both initial loads and client-side navigations.

**Alternatives considered**:
- Manual `<Suspense>` boundaries with inline fallbacks: More flexible but less consistent — the existing codebase prefers `loading.tsx` files.
- Client-side loading states with `useState`/`useEffect`: Rejected — the pages are server components; this would require fundamental architecture changes.

## R2: Skeleton Component Reuse

**Decision**: Reuse the existing `Skeleton` component from `src/components/ui/Skeleton.tsx`.

**Rationale**: The component already provides the correct visual style (`animate-pulse`, `bg-slate-100`, `rounded-md`) and is used in all 3 existing loading files and the `ProductGrid` component. Reusing it guarantees visual consistency (FR-010, FR-012).

**Alternatives considered**:
- New shimmer-effect component with gradient animation: Rejected — would introduce visual inconsistency with existing skeletons.

## R3: Persistent Chrome in Skeletons

**Decision**: Include real `Navbar`/`Footer` (storefront) or rely on the admin `layout.tsx` sidebar (admin) in skeleton states. Only the page content area shows skeleton placeholders.

**Rationale**: The existing `product/[slug]/loading.tsx` already renders the real `<Navbar />` and `<Footer />`. The admin layout (`/admin/layout.tsx`) already wraps all admin pages with the sidebar, so admin `loading.tsx` files only need to render the content area skeleton. This matches FR-011.

**Alternatives considered**:
- Full-page skeleton including navigation: Rejected — navigation is instant (no data fetching) and is already rendered by the layout.

## R4: Skeleton Shape Fidelity

**Decision**: Match the number of grid columns, card aspect ratios, and form field heights from the real pages. Use the existing pages' class names as a reference for skeleton dimensions.

**Rationale**: High-fidelity skeletons eliminate Cumulative Layout Shift (CLS). The existing `loading.tsx` files already follow this pattern (e.g., admin categories loading mirrors the table layout with 4 skeleton rows). SC-003 requires CLS < 0.05.

**Alternatives considered**:
- Generic full-width block skeletons: Rejected — would cause significant layout shift when real content loads.
