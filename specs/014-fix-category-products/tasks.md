# Implementation Tasks: Fix Nested Category Products Display

**Feature Branch:** 014-fix-category-products
**Plan Document:** /Users/mark/Coding/cozy-corner/specs/014-fix-category-products/plan.md

---

## Phase 1: Setup

*(No new project initialization or library additions are required for this feature. Existing stack is utilized.)*

## Phase 2: Foundational

**Goal:** Implement recursive category ID mapping logic without being coupled to active UI components.

- [x] T001 Implement `getCategoryDescendantIds(categoryId: string)` helper in `src/lib/actions/category-actions.ts`

## Phase 3: User Story 1 - View All Products within a Main Category

**Goal:** Ensure selecting a main category resolves both direct and deeply nested product descendants automatically.
**Independent Test:** Navigating to a top-level category with no direct products (but populated subcategories) populates the grid instead of showing an empty result.

- [x] T002 [US1] Refactor `src/app/category/[slug]/page.tsx` main product query (`prisma.product.findMany`) to filter using `categoryId: { in: [category.id, ...descendantIds] }`
- [x] T003 [US1] Update `src/app/category/[slug]/page.tsx` aggregations (`availableBrands` and `availableFilters`) to query against the expanded descendant array

## Phase 4: User Story 2 - Filter by Subcategory Options

**Goal:** Add UI elements mapping to child subcategories so users can narrow the deep scope correctly.
**Independent Test:** The category page visibly renders navigation links to direct subcategories, successfully mapping clicks to specific `/category/[sub-slug]` destinations.

- [x] T004 [P] [US2] Create new responsive `SubcategoryNav` component in `src/components/storefront/SubcategoryNav.tsx` 
- [x] T005 [US2] Update query in `src/app/category/[slug]/page.tsx` to apply `include: { children: true }` when isolating the current category
- [x] T006 [US2] Integrate `SubcategoryNav` passing the returned child categories to surface filtering options within `src/app/category/[slug]/page.tsx`

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T007 Ensure `SubcategoryNav` links visually indicate active states or smoothly blend nicely into the page aesthetics with animations.

## Dependencies

- **Phase 3 (US1)** depends on **Phase 2 (Foundational)**.
- **Phase 4 (US2)** can be integrated alongside or after Phase 3. 
- **T004** can run entirely in parallel with backend data fetching adjustments.

## Implementation Strategy

Begin by implementing the descendant fetch logic (`T001`) and applying it seamlessly to the product retrieval queries (`T002`, `T003`). This ensures the "empty bucket" main functionality is correctly satisfied (MVP). Then proceed to build out the `SubcategoryNav` interface seamlessly mapping the user to specific URLs per user story 2.
