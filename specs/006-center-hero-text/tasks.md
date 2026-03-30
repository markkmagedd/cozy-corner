# Tasks: Center Hero Text

**Input**: Design documents from `/specs/006-center-hero-text/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

None required. The project is already properly configured with Next.js and TailwindCSS.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

None required. No structural or foundational changes are needed for this CSS adjustment.

---

## Phase 3: User Story 1 - Centered Hero Text on Landing Page (Priority: P1) 🎯 MVP

**Goal**: Center-align the main hero text to draw attention effectively and visually balance the top of the page across all viewports.

**Independent Test**: Can be fully tested by loading the landing page and visually confirming text alignment across different breakpoints.

### Implementation for User Story 1

- [x] T001 [US1] Locate the hero container in `src/app/page.tsx` (or its imported hero component), and apply the `text-center` utility class to ensure horizontal text centering.
- [x] T002 [US1] Apply any additional layout adjustment classes (e.g., `mx-auto`, `items-center`) in `src/app/page.tsx` if the hero text container has a constrained width that also needs to be centered.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T003 Run quickstart.md verification steps to confirm responsive layout behavior on mobile, tablet, and desktop viewports.


---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 3)**: Can start immediately.
- **Polish (Final Phase)**: Depends on User Story 1 being fully completed.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.

### Parallel Opportunities

- N/A. The task is too small for practical parallelization.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1.
2. **STOP and VALIDATE**: Test User Story 1 independently across breakpoints using the dev server.
3. Deploy/demo.
