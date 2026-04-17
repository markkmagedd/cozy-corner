# Tasks: Admin AVIF Uploads

**Input**: Design documents from `/specs/016-admin-avif-uploads/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification. (None requested for this phase).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure per implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Configure Next.js image optimization for AVIF format in `next.config.ts`
- [x] T003 [P] Extend backend upload MIME type validation to accept `image/avif` dynamically in `src/app/api/upload/route.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload AVIF Image to Category (Priority: P1) 🎯 MVP

**Goal**: Admins can upload `.avif` images when creating or editing a category for optimized graphical assets.

**Independent Test**: Can be fully tested by creating or editing a category in the admin dashboard, uploading an `.avif` file, and verifying it displays correctly on both admin and storefront sides.

### Implementation for User Story 1

- [x] T004 [P] [US1] Extend image input `accept` attribute to allow `image/avif` in `src/components/admin/SingleImageUploader.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Upload AVIF Image to Product (Priority: P1)

**Goal**: Admins can upload `.avif` images to product galleries for better compression efficiency.

**Independent Test**: Can be fully tested by creating or editing a product, uploading `.avif` files to its image gallery, and checking both admin previews and storefront product pages.

### Implementation for User Story 2

- [x] T005 [P] [US2] Extend image input `accept` attribute to allow `image/avif` in `src/components/admin/ImageUploader.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T006 Run quickstart.md validation to manually test upload flow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational tasks (T002, T003) can be worked on in parallel.
- User Story 1 implementation task (T004) and User Story 2 implementation task (T005) can be executed in parallel as they touch different localized UI files without dependencies.

---

## Parallel Example: User Story 1 and User Story 2

```bash
# Launch implementation for US1 and US2 together (since they touch independent uploader components):
Task: "[US1] Extend image input accept attribute to allow image/avif in `src/components/admin/SingleImageUploader.tsx`"
Task: "[US2] Extend image input accept attribute to allow image/avif in `src/components/admin/ImageUploader.tsx`"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (SingleImageUploader logic)
   - Developer B: User Story 2 (ImageUploader logic)
3. Stories complete and integrate independently
