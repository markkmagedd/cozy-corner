# Tasks: Audit and fix mobile UI responsiveness

**Input**: Design documents from `/specs/020-mobile-ui-audit/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Manual visual testing (no automated tests requested in spec).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify local environment is running via `npm run dev` and accessible from mobile emulator

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Verify Tailwind CSS default mobile breakpoints are available and not overridden improperly in `src/app/globals.css` or `tailwind.config.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Storefront Browsing on Mobile (Priority: P1) 🎯 MVP

**Goal**: Fix homepage, categories, and variant selector layouts for mobile, ensuring no horizontal scrolling and adequate touch targets.

**Independent Test**: Load the homepage, navigate through categories to a product page on a mobile simulator, verifying no horizontal scrolling and proper element scaling.

### Implementation for User Story 1

- [x] T003 [P] [US1] Fix layout scaling and horizontal scroll on `src/app/page.tsx`
- [x] T004 [P] [US1] Update `src/components/storefront/HeroSection.tsx` and `src/components/storefront/FeaturedCategories.tsx` for mobile viewports (e.g., stack grid columns)
- [x] T005 [P] [US1] Adjust navigation menu touch targets and layout in `src/components/storefront/Navbar.tsx`
- [x] T006 [P] [US1] Fix category page responsiveness and grid layouts in `src/components/storefront/CategoryContent.tsx`
- [x] T007 [P] [US1] Fix variant selector touch targets in `src/components/storefront/product/VariantSelector.tsx` to be at least 44x44px equivalent

**Checkpoint**: At this point, User Story 1 should be fully functional and visually accurate on mobile.

---

## Phase 4: User Story 2 - Shopping Cart and Checkout on Mobile (Priority: P1)

**Goal**: Fix add-to-cart feedback and cart UI for mobile.

**Independent Test**: Add a product to the cart and interact with the cart feedback/sidebar on a mobile viewport.

### Implementation for User Story 2

- [x] T008 [P] [US2] Ensure Add to Cart buttons have minimum 44px touch targets in `src/components/storefront/product/ProductInfo.tsx` (Handled via global Button fix)
- [x] T009 [P] [US2] Ensure cart summary/feedback (handled in `src/components/storefront/Navbar.tsx` or similar) is readable and doesn't cause overflow on mobile

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently on mobile.

---

## Phase 5: User Story 3 - Mobile-Optimized Images and Media (Priority: P2)

**Goal**: Ensure images scale correctly without distorting the layout.

**Independent Test**: Verify image aspect ratios and gallery interactions on product listings and detail pages.

### Implementation for User Story 3

- [x] T010 [P] [US3] Ensure product images maintain aspect ratios on mobile in `src/components/storefront/ProductGrid.tsx` and `src/components/storefront/ProductCard.tsx`
- [x] T011 [P] [US3] Fix image gallery layout for vertical screens in `src/components/storefront/product/ProductGallery.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Run `quickstart.md` validation on a mobile device emulator (e.g., Chrome DevTools) to verify no horizontal scrolling remains
- [x] T013 Verify orientation changes (portrait to landscape) work smoothly across all adjusted components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- All tasks marked [P] within a specific Phase can run in parallel.
- Once Foundational phase completes, US1, US2, and US3 tasks can generally be tackled concurrently since they touch different components (`HeroSection` vs `ProductInfo` vs `ProductGallery`).

---

## Parallel Example: User Story 1

```bash
# Launch layout fixes in parallel:
Task: "Update HeroSection.tsx and FeaturedCategories.tsx for mobile viewports"
Task: "Adjust navigation menu touch targets in Navbar.tsx"
Task: "Fix category page responsiveness in CategoryContent.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently on mobile simulator
5. Proceed to next priorities.

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
