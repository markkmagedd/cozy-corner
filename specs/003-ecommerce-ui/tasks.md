# Tasks: Frontend E-commerce UI

**Input**: Design documents from `/specs/003-ecommerce-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create package dependencies in `package.json`
- [x] T002 Configure base build tools in `tsconfig.json`, `next.config.ts`, and `postcss.config.mjs`
- [x] T003 Configure theme limits in `tailwind.config.ts` enforcing Light Mode and pastel palettes
- [x] T004 Create foundational global styles in `src/app/globals.css`
- [x] T005 Setup Next.js root layout in `src/app/layout.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create Category and Product interfaces in `src/types/index.ts`
- [x] T007 [P] Create mock data configuration in `src/data/mock/categories.ts`
- [x] T008 [P] Create mock data configuration in `src/data/mock/products.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - E-commerce Homepage Navigation (Priority: P1) 🎯 MVP

**Goal**: Core UI components implemented (nav, hero, grid, deals) using mocked data.

**Independent Test**: The homepage can be verified independently by navigating to `/` and ensuring the HeroBanner, CategoryGrid, and DealsSection render correctly with the mocked data.

### Implementation for User Story 1

- [x] T009 [US1] Create skeleton loader component in `src/components/ui/Skeleton.tsx`
- [x] T010 [US1] Create slide-over UI primitive in `src/components/ui/SlideOver.tsx`
- [x] T011 [US1] Create modal UI primitive in `src/components/ui/Modal.tsx`
- [x] T012 [P] [US1] Create top navigation bar in `src/components/ui/Navbar.tsx`
- [x] T013 [P] [US1] Create footer component in `src/components/ui/Footer.tsx`
- [x] T014 [US1] Create hero banner component in `src/components/feature/HeroBanner.tsx`
- [x] T015 [US1] Create category card layout in `src/components/feature/CategoryCard.tsx`
- [x] T016 [US1] Create category grid layout in `src/components/feature/CategoryGrid.tsx`
- [x] T017 [US1] Create product card component with truncating in `src/components/feature/ProductCard.tsx`
- [x] T018 [US1] Create deals section component in `src/components/feature/DealsSection.tsx`
- [x] T019 [US1] Assemble all components on the homepage in `src/app/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Responsive Layout Compatibility (Priority: P1)

**Goal**: Adapt grids and banners perfectly across desktop, tablet, and mobile viewing widths.

**Independent Test**: Can be fully tested by resizing the browser window or loading the site on a mobile device and verifying layout adjustments.

### Implementation for User Story 2

- [x] T020 [P] [US2] Complete responsive refactor for `src/components/feature/CategoryGrid.tsx`
- [x] T021 [P] [US2] Complete responsive refactor for `src/components/feature/DealsSection.tsx`
- [x] T022 [P] [US2] Complete responsive refactor for `src/components/ui/Navbar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T023 [P] Validate UI layout limits visually across target breakpoints
- [x] T024 Validate application adheres to 0 error strict TS checks by executing `npx tsc --noEmit`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends directly on components created in US1

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All UI primitives in Phase 3 can run alongside feature components using mocked imports

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if applicable)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
