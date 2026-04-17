---
description: "Task list template for feature implementation"
---

# Tasks: Subcategory Navigation

**Input**: Design documents from `specs/015-subcategory-navigation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

There are no setup tasks explicitly needed since the Next.js App Router and Prisma environments are already fully configured off the existing project footprint.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

There are no foundational prerequisites blocking implementation, as there are no schema adjustments required.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View Sibling Subcategories (Priority: P1) 🎯 MVP

**Goal**: Fetch and visually render sibling subcategories identically to the main category UX on subcategory pages.

**Independent Test**: Navigate to a subcategory page and confirm visually distinct subcategories from the same parent are queried from the database and displayed.

### Implementation for User Story 1

- [X] T001 [P] [US1] Create `<SubcategoryNav>` component inheriting main category pill/tab responsive styles in `src/components/storefront/SubcategoryNav.tsx`
- [X] T002 [P] [US1] Update data-fetching in `src/app/(storefront)/categories/[categoryId]/[subcategoryId]/page.tsx` to query sibling subcategories from Prisma
- [X] T003 [US1] Integrate `<SubcategoryNav>` into the layout footprint of `src/app/(storefront)/categories/[categoryId]/[subcategoryId]/page.tsx` displaying the fetched items

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate to a Sibling Subcategory (Priority: P1)

**Goal**: Seamlessly route to siblings via clicks and highlight active route.

**Independent Test**: Click a sibling name; confirm URL changes and UI indicates the current active item. Validate that navigation doesn't display if there are 0 siblings available.

### Implementation for User Story 2

- [X] T004 [P] [US2] Update `src/components/storefront/SubcategoryNav.tsx` to use Next.js `<Link>` for instantaneous client-side navigation between siblings
- [X] T005 [US2] Enhance `src/components/storefront/SubcategoryNav.tsx` to highlight the current active subcategory by comparing its ID to the active layout parameter
- [X] T006 [US2] Implement empty-state hiding logic within `src/app/(storefront)/categories/[categoryId]/[subcategoryId]/page.tsx` to conditionally render `<SubcategoryNav>` only if sibling count > 0

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T007 Code cleanup and refactoring across navigational elements
- [X] T008 Run quickstart.md validation to guarantee zero layout shifts during Next.js navigation

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Stories (Phase 3+)**: US1 and US2 are closely coupled but can be done sequentially.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies.
- **User Story 2 (P1)**: Depends on US1 components being available structurally, but modifications can be done atop US1 seamlessly.

### Parallel Opportunities

- The creation of `SubcategoryNav.tsx` (T001) and server-side querying in `page.tsx` (T002) can be done in parallel before wiring.
- T004 and T005 can be accomplished simultaneously inside `SubcategoryNav.tsx`.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Scaffold the UI logic without navigation logic.
2. Ensure data pipes correctly from DB to UI.
3. **STOP and VALIDATE**: Test User Story 1 visually.
4. Proceed to US2 to add interactive routing. 

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
