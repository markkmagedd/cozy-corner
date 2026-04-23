# Implementation Plan: Dynamic Variant Availability Selection

**Branch**: `017-variant-availability` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/017-variant-availability/spec.md`

## Summary

Enhance the product page variant selector to dynamically disable unavailable variant combinations based on the user's current selection. When a shopper selects a size, colors that don't have that size in stock become visually disabled — and vice versa. The solution uses a hybrid approach: server-side default variant selection with redirect, and client-side availability matrix computation for instant interactive filtering. No database schema changes required.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19, Tailwind CSS 4, clsx, tailwind-merge  
**Storage**: PostgreSQL via Prisma ORM (existing schema — no migrations)  
**Testing**: Vitest (unit), Playwright (e2e)  
**Target Platform**: Web (server-rendered with client-side interactivity)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: < 200ms perceived response for variant selection changes (SC-002)  
**Constraints**: All variant data loaded at page-load time; no additional API calls for selection changes  
**Scale/Scope**: Typical product has < 50 variants; 2 dimensions max (color, size)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is a blank template — no project-specific gates defined. No violations possible. **PASS.**

## Project Structure

### Documentation (this feature)

```text
specs/017-variant-availability/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output — technical decisions
├── data-model.md        # Phase 1 output — entity & matrix design
├── quickstart.md        # Phase 1 output — developer guide
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── product/
│       └── [slug]/
│           └── page.tsx              # MODIFY: server-side default selection + redirect
├── components/
│   └── storefront/
│       └── product/
│           └── VariantSelector.tsx    # MODIFY: client-side availability matrix + visual states
├── lib/
│   └── variant-utils.ts              # NEW: availability matrix builder + helpers
└── types/
    └── index.ts                      # MODIFY: add AvailabilityState type
```

**Structure Decision**: Single Next.js project — all changes are within the existing `src/` directory. No new directories needed beyond the new `variant-utils.ts` file.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│ Server (page.tsx)                                   │
│                                                     │
│  1. Fetch product + variants via getProductBySlug   │
│  2. Read ?color=X&size=Y from searchParams          │
│  3. Validate params against available variants      │
│  4. If invalid → redirect() to default variant URL  │
│  5. Pass variants[] + selectedColor/Size to client  │
└──────────────────────┬──────────────────────────────┘
                       │ props
                       ▼
┌─────────────────────────────────────────────────────┐
│ Client (VariantSelector.tsx)                        │
│                                                     │
│  1. Build availability matrix from variants[]       │
│  2. For each option, compute availabilityState:     │
│     - "available" / "disabled" / "oos"              │
│  3. Render buttons with distinct visual styles      │
│  4. On click → update URL params                    │
│  5. On conflict → auto-switch to first available    │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **No API routes needed**: The full variant set is small enough to embed in the page props. Client-side filtering gives instant (0ms) response.

2. **Server-side redirect for defaults**: Prevents hydration mismatches and ensures the page always renders with a valid selection. Uses Next.js `redirect()`.

3. **Availability matrix pattern**: A `Map`-based lookup structure derived from the variant array on each render. Given the small data size (< 50 variants), this is negligible compute.

4. **Three-state model**: `available` → enabled and clickable; `disabled` → greyed out (available in other combinations); `oos` → strikethrough (globally out of stock). Two distinct visual cues satisfy SC-004.

5. **Auto-switch on conflict**: When selecting a dimension value that conflicts with the current other-dimension selection, the system auto-switches the other dimension to the first available option in display order.

### Component Changes

#### `page.tsx` (Server Component)

**Current behavior**: Computes `groups[]` with static `isAvailable` per option. Passes groups to VariantSelector.

**New behavior**:
- Read `searchParams.color` and `searchParams.size`
- Call `getDefaultVariant(variants)` to find fallback
- If params are missing or map to an unavailable variant → `redirect()` to URL with default variant params
- Pass raw `variants[]` array and validated `selectedColor`/`selectedSize` to VariantSelector
- Remove the server-side `groups` computation (moves to client)

#### `VariantSelector.tsx` (Client Component)

**Current behavior**: Receives pre-computed `groups[]` with static `isAvailable`. Renders buttons.

**New behavior**:
- Receives `variants[]` (raw variant data) + `selectedColor` + `selectedSize`
- On render: builds availability matrix, computes per-option `availabilityState`
- Three visual treatments per state (see data-model.md)
- On selection change: updates URL params; if conflict detected, auto-switches the other dimension
- Handles single-dimension products (only color or only size)

#### `variant-utils.ts` (New)

Pure utility functions — no side effects, easily unit-testable:

- `buildAvailabilityMatrix(variants: ProductVariant[])`: Returns the lookup matrix
- `getDefaultVariant(variants: ProductVariant[])`: Returns first available variant (by array order)
- `getOptionAvailability(matrix, dimension, value, otherDimension, otherValue?)`: Returns `"available" | "disabled" | "oos"`
- `resolveConflict(variants, dimension, newValue, otherDimension, currentOtherValue)`: Returns the first available value for otherDimension given the new dimension value, or null if none

## Complexity Tracking

No constitution violations to justify — no complexity tracking needed.
