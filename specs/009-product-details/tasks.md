---
description: "Task list template for feature implementation"
---

# Tasks: Product Details Page

**Input**: Design documents from `/specs/009-product-details/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are omitted as manual QA is deemed acceptable for MVP.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify database schema setup and run Prisma generation if needed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Implement data-fetching abstractions for product retrieval in `src/lib/actions/product-actions.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View Basic Product Information (Priority: P1) 🎯 MVP

**Goal**: Display core product details (title, price, description) efficiently via Server Component.

**Independent Test**: Page load is successful for a valid product slug, verifying the title, base price, and description are shown.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Create loading skeleton in `src/app/(storefront)/products/[slug]/loading.tsx`
- [ ] T004 [P] [US1] Create basic layout shell in `src/app/(storefront)/products/[slug]/page.tsx`
- [ ] T005 [P] [US1] Implement ProductInfo data component in `src/components/storefront/product/ProductInfo.tsx`
- [ ] T006 [US1] Mount `ProductInfo` securely on the server fetching logic inside `src/app/(storefront)/products/[slug]/page.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 3 - Select Product Variants (Priority: P1)

**Goal**: Present the user with available variant choices (Color and Size matrix) that reflect upon the URL parameters.

**Independent Test**: Changing a variant should alter the URL params without refreshing the page and update the highlighted selection state visually.

### Implementation for User Story 3

- [ ] T007 [P] [US3] Build the variant selection matrix component in `src/components/storefront/product/VariantSelector.tsx`
- [ ] T008 [US3] Integrate `VariantSelector` onto `src/app/(storefront)/products/[slug]/page.tsx` forwarding URL search parameter state
- [ ] T009 [US3] Update data-fetching in `product-actions.ts` if specific calculated product pricing/SKU based on variant is requested

**Checkpoint**: Users can navigate and select multi-dimensional variants on the Product Details page.

---

## Phase 5: User Story 2 - Interact with Product Media (Priority: P2)

**Goal**: Enable viewing multiple photos with smooth thumbnailed gallery interactions.

**Independent Test**: Users can load the page, immediately see the primary photo, and click any thumbnail to smoothly transition hero states.

### Implementation for User Story 2

- [x] T010 [P] [US2] Implement the `ProductGallery` client component handling local image swapping in `src/components/storefront/product/ProductGallery.tsx`
- [x] T011 [US2] Integrate `ProductGallery` with fetched image data into `src/app/(storefront)/products/[slug]/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Polish layout padding, gaps, and responsiveness for mobile devices across all Product components
- [x] T013 Finalize the SEO tags generation securely using the Next.js `generateMetadata` function inside `src/app/(storefront)/products/[slug]/page.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion

### Within Each User Story

- Models/Data-logic before components
- Implementation components before Page integration

### Parallel Opportunities

- Distinct components inside `src/components/storefront/` are siloed and can be built completely in parallel.
- US1, US2, and US3 UI Component scaffoldings are strictly uncoupled files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational Layer via Prisma Actions
3. Complete Phase 3: User Story 1 (Basic Details)
4. **STOP and VALIDATE**: Test basic rendering first.
5. Expand into variants and media galleries progressively.
