# Tasks: Products Page Layout

**Input**: Design documents from `/specs/004-products-page-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Framer Motion and Lucide React UI dependencies in `package.json` configurations
- [x] T002 [P] Create `src/types/product.ts` and define `Category` and `Product` types based on data model
- [x] T003 [P] Add `CategorySidebarProps` and `ProductCardProps` interface definitions in `src/types/product.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup database schema mappings and mock data payloads for products and categories in `src/lib/data-mock.ts`
- [x] T005 [P] Setup base file `src/app/(store)/products/page.tsx` integrating site header/footer
- [x] T006 [P] Setup base file `src/app/(store)/products/loading.tsx` for layout suspense fallbacks
- [x] T007 Build `src/lib/actions/product-actions.ts` boilerplate with Next.js 15 Server Actions

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Products by Category (Priority: P1) 🎯 MVP
**Goal**: Display hierarchical category sidebar and the responsive grid of corresponding products. Includes off-canvas mobile drawer.
**Independent Test**: Can be fully tested by clicking a category in the sidebar, verifying subcategories expand, and confirming the product grid populates with relevant items.

### Implementation for User Story 1
- [x] T008 [P] [US1] Create `src/components/navigation/CategorySidebar.tsx` incorporating subcategory toggle logic
- [x] T009 [P] [US1] Create `src/components/navigation/MobileDrawer.tsx` utilizing Framer Motion slide-in
- [x] T010 [US1] Build `src/components/products/ProductGrid.tsx` for responsive dynamic column display
- [x] T011 [US1] Wire up `src/components/navigation/CategorySidebar.tsx` and `MobileDrawer.tsx` to `src/app/(store)/products/page.tsx` layout
- [x] T012 [US1] Implement Server Action `fetchProductsByCategory()` inside `src/lib/actions/product-actions.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Interact with Product Cards (Priority: P2)
**Goal**: Detailed product views and quick actions (Favorite/Add to Cart) on item cards.
**Independent Test**: Can be tested independently by loading a static list of products in the grid and interacting with the buttons.

### Implementation for User Story 2
- [x] T013 [P] [US2] Build `src/components/products/ProductCard.tsx` parsing image, title, and current/original prices
- [x] T014 [US2] Implement heart icon favorite toggling UI and add-to-cart handlers in `src/components/products/ProductCard.tsx`
- [x] T015 [US2] Update `src/components/products/ProductGrid.tsx` to mount `ProductCard.tsx` for each item
- [x] T016 [US2] Implement `src/components/products/LoadMoreButton.tsx` logic passing offset cursors for the product grid

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Search and Sort Products (Priority: P3)
**Goal**: Sort dropdown and "Find product" layout actions above the grid.
**Independent Test**: Can be tested independently by selecting sorting options and observing the grid reorder according to the chosen criteria.

### Implementation for User Story 3
- [x] T017 [P] [US3] Create `src/components/products/TopActionBar.tsx` with Sort dropdown and Find Product trigger
- [x] T018 [US3] Update `src/app/(store)/products/ProductsPageClient.tsx` to place `TopActionBar.tsx` above `ProductGrid.tsx`
- [x] T019 [US3] Add sorting and search parameter handling to `fetchProductsByCategory()` in `src/lib/actions/product-actions.ts`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase N: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories

- [x] T020 Run `quickstart.md` validation steps across desktop and mobile breakpoints manually
- [x] T021 [P] Ensure dark mode Tailwind color system is consistently using uniform tokens (`amber-400`/`yellow-500` accents)
- [x] T022 Code cleanup, removing console statements, optimizing Framer Motion layout IDs

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories passing checks

### User Story Dependencies
- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 2 (P2)**: Extends US1 layout framework
- **User Story 3 (P3)**: Depends on US2 structure for sorting display

### Parallel Opportunities
- Mock data schema (T004) and type definitions (T002, T003)
- `CategorySidebar` (T008) and `MobileDrawer` (T009) can be styled by different developers simultaneously
- `ProductCard` UI (T013) can be built in isolation using Storybook or static mock data.
