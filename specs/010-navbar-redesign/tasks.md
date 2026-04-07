# Tasks: Navbar Redesign

**Input**: Design documents from `/specs/010-navbar-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design token setup

- [X] T001 [P] Install `framer-motion` dependency for premium animations
- [X] T002 [P] Define glassmorphism and navbar-specific design tokens in `src/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparing the component structure for subsequent user stories

- [X] T003 Refactor `src/components/storefront/Navbar.tsx` to include `sticky top-0 z-50` and glassmorphism base styles
- [X] T004 Remove all Cart-related imports and state from `src/components/storefront/Navbar.tsx`
- [X] T005 Remove Cart icon and conditional rendering logic from `src/components/storefront/Navbar.tsx`

**Checkpoint**: Foundation ready - Navbar is now sticky and cart-free; visual redesign follows.

---

## Phase 3: User Story 1 - Streamlined Desktop Navigation (Priority: P1) 🎯 MVP

**Goal**: Desktop users can access core pages via a beautiful, logical high-end navbar.

**Independent Test**: Load the app on a desktop; verify the navbar is sticky, looks premium, and all links work.

### Implementation for User Story 1

- [X] T006 [P] [US1] Update Logo styling in `src/components/storefront/Navbar.tsx` using `font-serif` and high-end tracking
- [X] T007 [US1] Modernize the layout of navigation links and `MegaMenu` trigger in `src/components/storefront/Navbar.tsx`
- [X] T008 [US1] Refactor `src/components/storefront/MegaMenu.tsx` with premium layout (multi-column) and glassmorphism styling
- [X] T009 [US1] Integrate `framer-motion` for smooth hover transitions in `src/components/storefront/MegaMenu.tsx`
- [X] T010 [US1] Implement "Active" state indicator for the current route in `src/components/storefront/Navbar.tsx`

**Checkpoint**: Deskstop navigation is fully functional, beautiful, and sticky.

---

## Phase 4: User Story 2 - Effective Mobile Navigation (Priority: P2)

**Goal**: Mobile users have a high-end, screen-optimized menu experience.

**Independent Test**: Switch to mobile viewport; open the hamburger menu; verify it fills the screen with premium styling and links work.

### Implementation for User Story 2

- [X] T011 [US2] Redesign the mobile menu drawer in `src/components/storefront/Navbar.tsx` with glassmorphism and full-screen overlay
- [X] T012 [US2] Implement `framer-motion` for the mobile menu entrance/exit animations in `src/components/storefront/Navbar.tsx`
- [X] T013 [US2] Ensure all mobile menu links meet 44x44 CSS pixel tap targets for accessibility in `src/components/storefront/Navbar.tsx`

---

## Phase 5: User Story 3 - Eliminating Broken Links (Priority: P2)

**Goal**: Zero dead ends in the primary navigation.

**Independent Test**: Click every link in the new navbar on both mobile and desktop; ensure no 404s.

### Implementation for User Story 3

- [X] T014 [US3] Audit and remove unused/broken links from `src/components/storefront/Navbar.tsx` (e.g., placeholder Blog or Sale links)
- [X] T015 [US3] Verify correct routing destinations for remaining links: Home, Shop, Categories in `src/components/storefront/Navbar.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final aesthetic and performance tweaks.

- [X] T016 [P] Add subtle scroll-triggered layout transitions (e.g., slight height contraction) in `src/components/storefront/Navbar.tsx`
- [X] T017 Performance check: ensure `backdrop-blur` doesn't cause lag on low-end mobile devices
- [X] T018 Run `quickstart.md` validation on final build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must run first to provide tools/tokens.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all UI refinements.
- **User Stories (Phase 3+)**: Depend on Foundational; can proceed in order P1 -> P2 -> US3.

### User Story Dependencies

- **User Story 1 (P1)**: The core desktop UI must be implemented before mobile (US2) can leverage the same logic.
- **User Story 2 (P2)**: Depends on the basic Navbar refactor but can be worked on after P1 structure is set.
- **User Story 3 (P3)**: A final cleanup phase that targets all links.

## Parallel Execution Opportunities

- T001 and T002 can run in parallel.
- T006 and T008 can run in parallel (Logo styling vs MegaMenu internal layout).
- T016 can be worked on as a final polish task by another developer.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (Desktop UI).
3. **STOP and VALIDATE**: Verify sticky behavior and new "premium" look on desktop.

### Incremental Delivery

1. Setup + Foundation -> Translucent Sticky Navbar shell.
2. User Story 1 -> Functional Desktop MegaMenu and refined typography.
3. User Story 2 -> Functional Mobile drawer with smooth animations.
4. User Story 3 -> Final link cleanup.
