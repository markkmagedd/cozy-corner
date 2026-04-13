# Tasks: Scalable Tabbed Navbar

**Input**: Design documents from `/specs/012-navbar-tabs-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic setup.

- [X] T001 [P] Audit existing `src/components/storefront/Navbar.tsx` for obsolete "single shop button" logic
- [X] T002 [P] Verify availability of `api/categories` endpoint and data structure for dynamic loading

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparing the multi-tab architecture.

- [X] T003 Refactor the desktop layout in `src/components/storefront/Navbar.tsx` to support a list-based navigation structure
- [X] T004 Create a reusable navigation tab sub-component (or logic) in `src/components/storefront/Navbar.tsx` that supports both links and triggers

**Checkpoint**: Core Navbar structure is ready for specific tab implementations.

---

## Phase 3: User Story 1 - Multi-Tab Navigation (Priority: P1) 🎯 MVP

**Goal**: Customer sees distinct "Categories", "New Arrivals", "Offers", and "Contact Us" tabs.

**Independent Test**: Load the desktop header; verify all four tabs are visible with correct labels and hover states.

### Implementation for User Story 1

- [X] T005 [US1] Implement "New Arrivals" tab link pointing to `/?search=new` in `src/components/storefront/Navbar.tsx`
- [X] T006 [US1] Implement "Offers" tab link pointing to `/?search=sale` in `src/components/storefront/Navbar.tsx`
- [X] T007 [US1] Implement "Contact Us" tab link pointing to `#footer` (or `/contact`) in `src/components/storefront/Navbar.tsx`
- [X] T008 [US1] Refactor "Categories" tab to serve as the new trigger for the `MegaMenu` in `src/components/storefront/Navbar.tsx`
- [X] T009 [US1] Apply consistent "Premium" glassmorphism styling to all new navigation tabs in `src/components/storefront/Navbar.tsx`

**Checkpoint**: Desktop multi-tab navigation is fully functional.

---

## Phase 4: User Story 2 - Scalable Categories (Priority: P1)

**Goal**: "Categories" mega-menu handles 20+ items using a scalable grid.

**Independent Test**: Populate mock data/API with 10+ categories and verify the mega-menu displays them in a clean, multi-column grid without breaking layout.

### Implementation for User Story 2

- [X] T010 [US2] Refactor `src/components/storefront/MegaMenu.tsx` to use a 4-column responsive grid layout optimized for large lists
- [X] T011 [US2] Implement dynamic category fetching and mapping specifically for the new grid layout in `src/components/storefront/MegaMenu.tsx`
- [X] T012 [US2] Adjust `MegaMenu` glassmorphism panel width for a broader, more informative desktop presentation in `src/components/storefront/MegaMenu.tsx`

**Checkpoint**: Categories tab is now highly scalable and handles dynamic growth.

---

## Phase 5: User Story 3 - Static Information Pages (Priority: P2)

**Goal**: Provide quick access to non-product information via navbar.

**Independent Test**: Click "Contact Us" and verify the user is redirected or the page section is focused.

### Implementation for User Story 3

- [X] T013 [US3] Ensure the `#footer` or `/contact` destination is properly configured and reachable from the navbar in `src/components/storefront/Navbar.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive mapping and aesthetic consistency.

- [X] T014 [P] Update the mobile menu drawer in `src/components/storefront/Navbar.tsx` to include the new tab list (vertical)
- [X] T015 [P] Implement `framer-motion` staggered animations for the new mobile menu list entries in `src/components/storefront/Navbar.tsx`
- [X] T016 Final visual audit: Ensure spacing between tabs is logically balanced across different desktop resolutions
- [X] T017 Run `quickstart.md` validation across all new tabs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundational (Phases 1-2)**: Must complete first to establish the tabbed structure.
- **User Stories (Phase 3-4)**: Critical for the site's primary navigation.
- **Polish (Phase 6)**: Final mobile and aesthetic refinement.

### Parallel Execution Opportunities

- T005, T006, and T007 (static links) can be implemented in parallel.
- T010 and T011 (MegaMenu refactor) can be worked on concurrently with stationary link implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phases 1 & 2.
2. Complete Phase 3 (Multi-tab Desktop UI).
3. **STOP and VALIDATE**: Verify all 4 tabs are present and look premium.

### Incremental Delivery

1. Setup + Foundation -> Empty Tabbed Navbar.
2. User Story 1 -> Desktop header with all links and Category trigger.
3. User Story 2 -> Scalable Category Menu growth support.
4. User Story 3 + Polish -> Mobile responsiveness and final audit.
