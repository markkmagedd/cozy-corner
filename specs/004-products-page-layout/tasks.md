# Tasks: Products Page Layout & Details Flow

**Input**: Design documents from `/specs/004-products-page-layout/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project directories initialization for the feature.

- [X] T001 Create route directories `src/app/products/[productId]`
- [X] T002 [P] Create components directories `src/components/layout` and `src/components/products`
- [X] T003 [P] Create types directory `src/types`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data models and types that MUST be complete before ANY user story can be implemented.

- [X] T004 Define shared interfaces (`Category`, `Product`, `PaginatedResponse`) matching data model in `src/types/product.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse Product Hierarchy (Priority: P1) 🎯 MVP

**Goal**: Users browse the product catalog using a hierarchical category sidebar to narrow down their search by navigating through nested subcategories.

**Independent Test**: The sidebar renders the category hierarchy and updates the URL `?category=` parameter upon selection.

### Implementation for User Story 1

- [X] T005 [US1] Create `CategorySidebar` component matching UI prop contracts in `src/components/layout/CategorySidebar.tsx`
- [X] T006 [US1] Implement basic `/products` layout bringing in `CategorySidebar` handling URL state in `src/app/products/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently with URL state updating.

---

## Phase 4: User Story 2 - View Product Grid (Priority: P1)

**Goal**: Users view a structured grid of products based on the active category showing necessary top-level details (image, title, price).

**Independent Test**: The grid successfully renders product cards and standard pagination updates `?page=` when clicked.

### Implementation for User Story 2

- [X] T007 [P] [US2] Create responsive `ProductCard` component with image, title, price in `src/components/products/ProductCard.tsx`
- [X] T008 [P] [US2] Create `Pagination` component utilizing URL Search Params in `src/components/products/Pagination.tsx`
- [X] T009 [US2] Create `ProductGrid` component utilizing `ProductCard` and Framer Motion stagger in `src/components/products/ProductGrid.tsx` (depends on T007)
- [X] T010 [US2] Integrate `ProductGrid` and `Pagination` into `src/app/products/page.tsx` to handle `?category` and `?page` fetching and display (depends on T008, T009)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently to provide a robust filtering grid.

---

## Phase 5: User Story 3 - View Product Details (Priority: P2)

**Goal**: Users click on a specific product from the grid to navigate to a dedicated detail page that exposes deeper attributes like available sizes.

**Independent Test**: Direct linking to `/products/[productId]` renders the full product details.

### Implementation for User Story 3

- [X] T011 [P] [US3] Create `ProductDetails` component showing complete product fields in `src/components/products/ProductDetails.tsx`
- [X] T012 [US3] Implement `/products/[productId]/page.tsx` rendering the `ProductDetails` component (depends on T011)
- [X] T013 [US3] Update `ProductCard` in `src/components/products/ProductCard.tsx` to wrap the card in a Next.js `<Link>` pointing to `/products/${product.id}`

**Checkpoint**: All user stories should now be independently functional, forming a complete e-commerce flow.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements ensuring UI polish and constitutional alignment.

- [X] T014 Review responsive behavior on mobile viewports for Sidebar and Grid sizing adjustments.
- [X] T015 Verify Framer Motion layout animations don't introduce lag or accessibility issues for `ProductGrid`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. User Story 2 builds upon User Story 1's skeleton. User Story 3 builds upon User Story 2's cards.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P1)**: Highly parallelizable but expects `page.tsx` from US1.
- **User Story 3 (P2)**: Can be built completely in parallel and integrated last.

### Parallel Opportunities

- T002 and T003 can be executed simultaneously.
- T007 (Card) and T008 (Pagination) can be authored entirely in parallel.
- T011 (Detail Component) can be authored while U1 and US2 are in progress.

## Implementation Strategy

### Incremental Delivery

1. Setup routing directories and types definitions.
2. Build the visual Sidebar and mock the active route switching (US1 MVP).
3. Author the Grid view, Cards, and Pagination then wire them to the active route SearchParams (US2).
4. Build the separate Details route to complete the navigation funnel (US3).
