# Tasks: Hotel Shop Product Catalog

**Input**: Design documents from `/specs/002-product-catalog/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js app router structure in src/ (ensure Tailwind is setup in tailwind.config.ts)
- [X] T002 [P] Install dependencies: `framer-motion lucide-react clsx tailwind-merge`
- [X] T003 Build utility functions in src/lib/utils.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Category mock data array in src/data/mock-categories.ts
- [X] T005 [P] Create Product mock data array in src/data/mock-products.ts
- [X] T006 Implement simulated API in src/lib/api.ts (getProducts, getProductBySlug, getCategories)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Product Catalog on Mobile (Priority: P1) 🎯 MVP

**Goal**: Visitors can view a card-based grid layout of products, supporting infinite scrolling to load more.

**Independent Test**: Load the root page `/` and scroll down to ensure products animate in and load progressively.

### Implementation for User Story 1

- [ ] T007 [US1] Create ProductCard component in src/components/ui/ProductCard.tsx
- [ ] T008 [US1] Create InfiniteProductGrid component in src/components/feature/InfiniteProductGrid.tsx
- [ ] T009 [US1] Implement root product listing page in src/app/page.tsx integrating InfiniteProductGrid

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Filter Products by Category (Priority: P1)

**Goal**: Visitors can select category tabs to filter the product grid, with state preserved in URL params.

**Independent Test**: Click category tabs and verify the URL updates contextually and only matching products appear.

### Implementation for User Story 2

- [X] T010 [P] [US2] Create CategoryNav component in src/components/ui/CategoryNav.tsx
- [X] T011 [US2] Update src/app/page.tsx to pass `category` searchParams to API layer
- [X] T012 [US2] Update InfiniteProductGrid to reset data array when category filter changes

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Product Detail Page (Priority: P1)

**Goal**: Visitors can tap a product to view details (images, colors, sizes) on a dedicated route.

**Independent Test**: Click a product card to navigate to `/product/[slug]` and verify that images, details, sizes, and colors display correctly.

### Implementation for User Story 3

- [X] T013 [P] [US3] Create ImageGallery carousel component in src/components/feature/ImageGallery.tsx
- [X] T014 [P] [US3] Create SelectionFeedback component in src/components/feature/SelectionFeedback.tsx
- [X] T015 [US3] Implement product detail page in src/app/product/[slug]/page.tsx

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 5 - Navigate with Persistent Header and Branding (Priority: P2)

**Goal**: Storefront has a sticky header with branding accessible at all times while scrolling.

**Independent Test**: Scroll down the listing page and verify the header remains pinned at the top.

### Implementation for User Story 5

- [X] T016 [P] [US5] Create Header component in src/components/ui/Header.tsx
- [X] T017 [US5] Update root layout in src/app/layout.tsx to include the Header persistently

---

## Phase 7: User Story 4 - Modern, Premium Visual Experience (Priority: P2)

**Goal**: Ensure all interactions feel premium via animations, hover states, and smooth image reveals.

**Independent Test**: Navigate through the app assessing Framer Motion transitions and visual feedback.

### Implementation for User Story 4

- [X] T018 [P] [US4] Add layout page transitions in src/app/template.tsx
- [X] T019 [US4] Add AnimatePresence filtering transitions to InfiniteProductGrid in src/components/feature/InfiniteProductGrid.tsx
- [X] T020 [US4] Add hover effects and smooth image loading reveal to ProductCard in src/components/ui/ProductCard.tsx

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T021 [P] Ensure responsive layouts work up to Desktop/Tablet standard width 
- [X] T022 [P] Extract reusable Tailwind tokens for colors/spacing in tailwind.config.ts if necessary
- [X] T023 Run complete app walkthrough checking edge cases (empty states)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2.
- **User Story 2 (P1)**: Extends US1, relies on Grid from US1.
- **User Story 3 (P1)**: Extends US1, relies on routing from Grid.
- **User Story 5 (P2)**: Relies on root layout (can execute concurrently with US1).
- **User Story 4 (P2)**: A visual layer applied over all other stories, best executed last.

### Parallel Opportunities

- Phase 2 mock data building (T004, T005) can be constructed in parallel.
- Detail page components (T013, T014) can be built concurrently.
- US5 (Header) can be worked on in parallel with US3 (Detail Page).
- Visual enhancements (T018) can be setup independently of the grid UI.
