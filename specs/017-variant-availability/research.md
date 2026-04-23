# Research: Dynamic Variant Availability Selection

**Feature**: 017-variant-availability  
**Date**: 2026-04-23

## R1: Client-Side vs Server-Side Availability Computation

**Decision**: Hybrid — server computes the full variant data set and default selection; client handles dynamic filtering on interaction.

**Rationale**: The current product page (`/product/[slug]/page.tsx`) is a server component that already fetches all variants via `getProductBySlug`. Passing the full variant array to a client component allows instant, zero-latency filtering without additional network requests. This satisfies SC-002 (< 200ms perceived response). The server side handles default variant selection and URL param validation (FR-005, FR-011) to avoid layout shifts.

**Alternatives considered**:
- Pure server-side (full page reload per selection): Rejected — violates FR-007 (no full page reloads) and SC-002 (latency).
- Client-side fetch on each selection (API call): Rejected — unnecessary network overhead when the full variant set is already small and can be sent on initial load.

## R2: Availability Matrix Data Structure

**Decision**: Build an in-memory availability matrix from the flat variant array on the client side. Use a `Map<string, Set<string>>` keyed by `"color:value"` or `"size:value"` mapping to the set of available partner values.

**Rationale**: The `ProductVariant[]` array (with `color`, `size`, `isAvailable` fields) contains all necessary data. A matrix derived client-side from this array enables O(1) lookups for "is color X available when size Y is selected?" This avoids any schema changes.

**Alternatives considered**:
- Pre-computed matrix from server/API: Rejected — adds unnecessary complexity; variant counts per product are small (typically < 50).
- Flat filter on every render: Considered viable for small sets but matrix provides cleaner code structure.

## R3: URL Search Params for Variant State

**Decision**: Continue using URL search params (`?color=Black&size=32`) as the source of truth for selected variants, matching the existing `VariantSelector` pattern.

**Rationale**: The current component already uses `useSearchParams` + `router.replace` for selections. This enables shareable/bookmarkable URLs (FR-011) and aligns with Next.js App Router conventions. Server-side validation of params happens before rendering.

**Alternatives considered**:
- React state only (no URL sync): Rejected — loses shareability and breaks existing behavior.
- Dedicated state management (Zustand/Redux): Rejected — overkill for 2-dimensional selection state.

## R4: Default Variant Selection Strategy

**Decision**: Server-side redirect. The server component reads URL search params, validates them against available variants, and if invalid or absent, redirects to the URL with valid default params (first available variant in display order).

**Rationale**: This prevents hydration mismatches and layout shifts (the page always renders with a valid selection). The current page.tsx already has access to `searchParams` and variant data. A `redirect()` call from Next.js handles this cleanly.

**Alternatives considered**:
- Client-side default selection on mount: Rejected — causes a flash of unselected state.
- No default (require user to pick): Rejected — contradicts FR-005 and User Story 4.

## R5: Visual Differentiation — Disabled vs Out-of-Stock

**Decision**: Two distinct visual treatments:
1. **Disabled by selection context**: Reduced opacity (semi-transparent), no strikethrough. Tooltip: "Not available in [selected size/color]".
2. **Globally out of stock** (`isAvailable = false` across all combinations): Strikethrough line + "Out of Stock" tooltip. Lowest opacity.

**Rationale**: The current VariantSelector already has a strikethrough treatment for out-of-stock options. Adding a separate, softer disabled state (opacity only, no strikethrough) creates clear visual differentiation (SC-004 — two distinct cues).

**Alternatives considered**:
- Single disabled style for both: Rejected — violates FR-004 and SC-004.
- Text label on each disabled button: Rejected — creates visual clutter in a compact button layout.
