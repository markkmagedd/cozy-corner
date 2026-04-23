# Tasks: Dynamic Variant Availability Selection

**Input**: Design documents from `/specs/017-variant-availability/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the new utility module and add the shared type definitions needed by all user stories.

- [x] T001 [P] Add `AvailabilityState` type (`"available" | "disabled" | "oos"`) and `VariantOptionWithState` interface to `src/types/index.ts`
- [x] T002 [P] Create `src/lib/variant-utils.ts` with the following pure functions: `buildAvailabilityMatrix(variants)`, `getDefaultVariant(variants)`, `getOptionAvailability(matrix, dimension, value, otherDimension, otherValue)`, `resolveConflict(variants, dimension, newValue, otherDimension, currentOtherValue)`, `extractUniqueColors(variants)`, `extractUniqueSizes(variants)`

**Checkpoint**: Utility module and types exist. No UI changes yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor the server component to pass raw variant data and validate URL params — this is the foundation for all client-side dynamic behavior.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Refactor `src/app/product/[slug]/page.tsx` to remove the server-side `groups` computation (lines 33–65), import `getDefaultVariant` from `src/lib/variant-utils.ts`, read and validate `searchParams.color` and `searchParams.size` against the product's available variants, and `redirect()` to the URL with valid default params if the current params are missing or map to an unavailable variant
- [x] T004 Update the `VariantSelector` props interface in `src/components/storefront/product/VariantSelector.tsx` to accept `variants: ProductVariant[]`, `selectedColor: string | null`, and `selectedSize: string | null` instead of `groups: VariantGroup[]`. Update the import and props passed from `src/app/product/[slug]/page.tsx` accordingly. Ensure the component renders without errors (can use a basic static rendering of buttons as a placeholder).

**Checkpoint**: Product page loads with server-side default selection and redirect. VariantSelector receives raw variant data. The old `groups` pattern is fully removed.

---

## Phase 3: User Story 1 — Select a Size and See Available Colors (Priority: P1) 🎯 MVP

**Goal**: When a shopper selects a size, colors that don't have that size in stock are visually disabled.

**Independent Test**: Navigate to a product page with multiple color/size variants, select a size, and verify that only colors with stock for that size remain selectable.

### Implementation for User Story 1

- [x] T005 [US1] In `src/components/storefront/product/VariantSelector.tsx`, call `buildAvailabilityMatrix(variants)` and `getOptionAvailability()` on each render to compute per-color-option `availabilityState` based on the currently selected size (from `selectedSize` prop / URL param)
- [x] T006 [US1] In `src/components/storefront/product/VariantSelector.tsx`, update the color button rendering to apply three distinct visual styles based on `availabilityState`: `"available"` (full opacity, clickable), `"disabled"` (reduced opacity ~40%, `cursor-not-allowed`, no strikethrough), `"oos"` (lowest opacity ~20%, strikethrough line, "Out of Stock" tooltip)
- [x] T007 [US1] In `src/components/storefront/product/VariantSelector.tsx`, update `handleSelect` for size changes to call `resolveConflict()` — if the currently selected color is not available for the newly selected size, auto-switch the color URL param to the first available color in display order

**Checkpoint**: Selecting a size dynamically disables/enables color buttons. Auto-switch works on conflict. This is the MVP.

---

## Phase 4: User Story 2 — Select a Color and See Available Sizes (Priority: P1)

**Goal**: When a shopper selects a color, sizes that don't exist for that color are visually disabled.

**Independent Test**: Navigate to a product page, select a color, and verify that only sizes with stock for that color remain selectable.

### Implementation for User Story 2

- [x] T008 [US2] In `src/components/storefront/product/VariantSelector.tsx`, extend the availability computation to also compute per-size-option `availabilityState` based on the currently selected color (symmetric to US1 color logic)
- [x] T009 [US2] In `src/components/storefront/product/VariantSelector.tsx`, update the size button rendering to apply the same three visual styles (`"available"`, `"disabled"`, `"oos"`) used for color buttons, adapted for the rectangular size button design (strikethrough line for OOS, reduced opacity for disabled)
- [x] T010 [US2] In `src/components/storefront/product/VariantSelector.tsx`, update `handleSelect` for color changes to call `resolveConflict()` — if the currently selected size is not available for the newly selected color, auto-switch the size URL param to the first available size in display order

**Checkpoint**: Both directions of variant selection filtering are fully functional. Selecting any dimension dynamically updates the other.

---

## Phase 5: User Story 3 — Visual Distinction Between Disabled and Out-of-Stock (Priority: P2)

**Goal**: Shoppers can visually distinguish between options disabled due to the current selection vs. options that are globally out of stock.

**Independent Test**: Set up a product with some variants having `isAvailable = false` for all combinations of a color/size, and verify distinct visual treatments for "disabled by selection" vs "globally out of stock".

### Implementation for User Story 3

- [x] T011 [US3] In `src/lib/variant-utils.ts`, verify `getOptionAvailability()` correctly returns `"oos"` when all variants for a given color (or size) have `isAvailable = false`, regardless of the other dimension's selection — add the `isGloballyOos(variants, dimension, value)` helper if not already covered by the matrix logic
- [x] T012 [US3] In `src/components/storefront/product/VariantSelector.tsx`, refine the `"oos"` visual treatment for color buttons: lowest opacity (~20%), diagonal strikethrough line, tooltip reads "Out of Stock" (not "Not available in [size]")
- [x] T013 [US3] In `src/components/storefront/product/VariantSelector.tsx`, refine the `"disabled"` visual treatment for color buttons: medium opacity (~40%), NO strikethrough, tooltip reads "Not available in size [X]" (where X is the selected size)
- [x] T014 [US3] In `src/components/storefront/product/VariantSelector.tsx`, apply the same `"oos"` vs `"disabled"` visual distinction to size buttons: OOS gets strikethrough + lowest opacity, disabled gets medium opacity + contextual tooltip "Not available in [color]"

**Checkpoint**: Two clearly distinct visual states for "disabled by selection" and "globally out of stock" are visible across both color and size buttons.

---

## Phase 6: User Story 4 — Default Variant Selection on Page Load (Priority: P2)

**Goal**: Product page always loads with a valid, in-stock variant pre-selected. Shared URLs with invalid params fallback to the default.

**Independent Test**: Load a product page without URL params and verify a valid variant is auto-selected. Load with invalid params and verify fallback to default.

### Implementation for User Story 4

- [x] T015 [US4] In `src/app/product/[slug]/page.tsx`, verify and refine the redirect logic (from T003) to handle all edge cases: no params → redirect to default, partial params (only color or only size) → complete with matching available option, both params invalid → redirect to full default
- [x] T016 [US4] In `src/app/product/[slug]/page.tsx`, handle the edge case where ALL variants are out of stock: do NOT redirect (no valid default exists), instead pass a flag `allOutOfStock: true` to the VariantSelector
- [x] T017 [US4] In `src/components/storefront/product/VariantSelector.tsx`, when `allOutOfStock` is true, render all buttons as disabled with the `"oos"` style and display a prominent "This product is currently out of stock" message above or below the variant selector

**Checkpoint**: Product page never loads in an ambiguous state. Default selection, URL validation, and all-OOS edge case are handled.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Handle remaining edge cases and single-dimension products.

- [x] T018 [P] In `src/components/storefront/product/VariantSelector.tsx`, handle single-dimension products (only color or only size): render the single dimension with availability based solely on `isAvailable` per variant, skip cross-dimension logic
- [x] T019 [P] In `src/components/storefront/product/VariantSelector.tsx`, handle products with no variants: render nothing (return `null`), matching current behavior
- [x] T020 In `src/app/product/[slug]/page.tsx`, handle single-dimension products in the redirect logic: only validate/set the param for the dimension that exists
- [x] T021 Verify the complete flow end-to-end: navigate between product pages, test with real product data from the admin dashboard, confirm no layout shifts or hydration mismatches

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Phase 2 completion
  - US1 (Phase 3) and US2 (Phase 4) can run in parallel (different selection directions, but same file — recommend sequential)
  - US3 (Phase 5) depends on US1 + US2 (needs both direction's buttons to apply visual distinction)
  - US4 (Phase 6) depends on Phase 2 (redirect logic) but is independent of US1–US3 visual work
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P1)**: Can start after Phase 2 — Same file as US1, recommend sequential after US1
- **US3 (P2)**: Depends on US1 + US2 completion (builds on their visual state system)
- **US4 (P2)**: Can start after Phase 2 — Independent of US1–US3

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T018 and T019 can run in parallel (different concerns within the same file, non-overlapping)
- US4 (T015–T017) can run in parallel with US1/US2 if needed (different files: page.tsx vs VariantSelector.tsx)

---

## Parallel Example: Phase 1

```bash
# Launch both setup tasks together:
Task: "Add AvailabilityState type to src/types/index.ts"
Task: "Create variant-utils.ts with pure utility functions in src/lib/variant-utils.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T004)
3. Complete Phase 3: User Story 1 (T005–T007)
4. **STOP and VALIDATE**: Select a size, verify colors update dynamically
5. Deploy/demo if ready — this delivers the core value

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Size→Color filtering works → **MVP!**
3. Add US2 → Color→Size filtering works → Both directions complete
4. Add US3 → Visual distinction between disabled/OOS → Polish
5. Add US4 → Default selection + URL validation → Robust
6. Polish → Edge cases, single-dimension products → Complete

---

## Notes

- All tasks modify only 3 existing files + 1 new file — small, focused scope
- No database migrations required
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each phase checkpoint
- The VariantSelector is a `'use client'` component — all availability logic runs client-side after initial server render
