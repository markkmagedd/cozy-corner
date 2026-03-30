# Tasks: All Categories Page

**Input**: Design documents from `/specs/008-all-categories-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual validation steps are included via quickstart.md. Automated testing is out of scope per plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create empty `src/components/storefront/AllCategoriesGrid.tsx` component file.
- [x] T002 [P] Create empty `src/app/categories/page.tsx` server component file.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

*(N/A - Project and Prisma schema are already established. Moving directly to user stories.)*

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View All Categories Page (Priority: P1) 🎯 MVP

**Goal**: Display a dedicated page listing all available top-level product categories visually.

**Independent Test**: Navigate to `/categories` and verify that top-level categories are visible as cards, using product images as dynamic thumbnails (or fallbacks).

### Implementation for User Story 1

- [x] T003 [P] [US1] Implement `AllCategoriesGrid` UI component in `src/components/storefront/AllCategoriesGrid.tsx`, handling props for category data and empty states.
- [x] T004 [US1] Implement data fetching logic in `src/app/categories/page.tsx` using Prisma. Fetch top-level categories (`parentId: null`) and include the first active product's primary image to avoid N+1 queries.
- [x] T005 [US1] Import and render the `AllCategoriesGrid` component inside `src/app/categories/page.tsx`, passing the formatted category data.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate to Specific Category (Priority: P2)

**Goal**: Enable users to click on isolated category cards to navigate to the specific product listings.

**Independent Test**: Click any category card on the `/categories` page and verify it correctly routes to `/category/{slug}`.

### Implementation for User Story 2

- [x] T006 [US2] Update `src/components/storefront/AllCategoriesGrid.tsx` to wrap each category card in a Next.js `<Link>` pointing to `/category/{slug}`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T007 Run validation steps outlined in `specs/008-all-categories-page/quickstart.md` to ensure responsive design, empty states, and dynamic thumbnail routing all operate flawlessly.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup.
- **User Story 2 (P2)**: Depends heavily on US1 finishing the `<AllCategoriesGrid>` component logic natively.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T003 (UI) and T004 (Data Fetching) can run in parallel by mocking data in the UI initially.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test `/categories` visual load independently without worrying about routing.

### Incremental Delivery

1. Add User Story 1 → Test visual grid rendering independently.
2. Add User Story 2 → Test `<Link>` routing functionalities independently.
3. Finish Polish tasks.
