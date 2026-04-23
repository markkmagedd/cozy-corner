# Tasks: Skeleton Loading States

**Input**: Design documents from `/specs/018-skeleton-loading/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — the existing `Skeleton` component and Next.js App Router loading convention are already in place. Proceeding directly to user story phases.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational work needed — all 8 `loading.tsx` files are independent of each other and have no shared dependencies beyond the existing `Skeleton` component.

**Checkpoint**: Skip to user stories — all prerequisites already exist.

---

## Phase 3: User Story 1 — Storefront Pages Show Skeleton Loading (Priority: P1) 🎯 MVP

**Goal**: Shoppers see skeleton placeholders on the homepage, categories listing, and category detail pages during server-side data fetching.

**Independent Test**: Add `await new Promise(r => setTimeout(r, 3000))` to each storefront page component, navigate to the page, and verify skeleton appears instantly with layout matching the loaded page.

### Implementation for User Story 1

- [x] T001 [P] [US1] Create homepage skeleton loading in `src/app/loading.tsx` — render `<Navbar />`, hero section placeholder (full-width rounded rectangle), product grid skeleton (4 columns × 2 rows = 8 cards, each with square aspect-ratio image + 2 text lines using `<Skeleton />`), and `<Footer />`
- [x] T002 [P] [US1] Create categories listing skeleton loading in `src/app/categories/loading.tsx` — render `<Navbar />`, page header placeholder (centered title + subtitle skeletons matching the "Our Collections" header), category card grid skeleton (3 columns × 2 rows = 6 cards, each with 4:3 aspect-ratio image + text line), and `<Footer />`
- [x] T003 [P] [US1] Refactor category detail for partial loading — Implement `CategoryContent` and `CategoryLowerSkeleton` components, wrap lower section in `<Suspense>`, and remove full-page `loading.tsx` to ensure the header stays static during subcategory navigation.

**Checkpoint**: All 3 storefront pages show skeletons. Shoppers never see blank pages during data fetching.

---

## Phase 4: User Story 2 — Admin Pages Show Skeleton Loading (Priority: P1)

**Goal**: Admin users see skeleton placeholders on the dashboard, product/category creation forms, and product/category edit forms during server-side data fetching.

**Independent Test**: Add `await new Promise(r => setTimeout(r, 3000))` to each admin page component, navigate to the page, and verify skeleton appears instantly. Admin sidebar and header should render immediately (provided by layout).

### Implementation for User Story 2

- [x] T004 [P] [US2] Create admin dashboard skeleton loading in `src/app/admin/loading.tsx` — render 4 stat cards in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`), each card with a circular icon placeholder and 2 text line skeletons, matching the existing dashboard layout
- [x] T005 [P] [US2] Create admin new product form skeleton in `src/app/admin/products/new/loading.tsx` — render page header (title + subtitle skeletons), followed by form skeleton with 6 full-width input field placeholders (h-10), a textarea placeholder (h-24), a dropdown placeholder, and a submit button placeholder
- [x] T006 [P] [US2] Create admin edit product form skeleton in `src/app/admin/products/[id]/edit/loading.tsx` — render page header (title + subtitle skeletons), followed by form skeleton matching T005 layout plus an image gallery placeholder section (grid of 3 square skeleton blocks for existing images)
- [x] T007 [P] [US2] Create admin new category form skeleton in `src/app/admin/categories/new/loading.tsx` — render page header (title + subtitle skeletons), followed by form skeleton with 4 input field placeholders, a textarea placeholder, a dropdown placeholder (parent category), and a submit button placeholder
- [x] T008 [P] [US2] Create admin edit category form skeleton in `src/app/admin/categories/[id]/edit/loading.tsx` — render page header (title + subtitle skeletons), followed by form skeleton matching T007 layout plus an image placeholder for the category image

**Checkpoint**: All 5 admin pages show skeletons. Admin users never see blank pages during data fetching. Admin sidebar and header render instantly from layout.

---

## Phase 5: User Story 3 — Skeleton Layouts Match Final Content Shape (Priority: P2)

**Goal**: All skeleton layouts have been built to match their real page layouts. This phase is a verification and refinement pass.

**Independent Test**: Compare each skeleton side-by-side with its loaded page. Verify column counts, card proportions, and form field heights match.

### Implementation for User Story 3

- [x] T009 Verify and refine all 3 storefront skeleton files (T001–T003) — navigate to each page with artificial delay, visually compare skeleton to loaded page, adjust any mismatched column counts, card aspect ratios, or spacing values
- [x] T010 Verify and refine all 5 admin skeleton files (T004–T008) — navigate to each admin page with artificial delay, visually compare skeleton to loaded page, adjust any mismatched form field heights, card dimensions, or grid structures

**Checkpoint**: All 8 skeletons match their corresponding page layouts. CLS on transition is imperceptible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency and cleanup pass.

- [x] T011 Verify all 8 `loading.tsx` files import `Skeleton` from `@/components/ui/Skeleton` consistently, and storefront loading files import `Navbar` and `Footer` consistently with the existing `src/app/product/[slug]/loading.tsx` pattern
- [x] T012 Run the dev server and navigate through all 8 routes to confirm no build errors, no hydration mismatches, and skeletons render correctly on both initial load and client-side navigation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — no setup needed
- **Foundational (Phase 2)**: Skipped — no foundational work needed
- **User Story 1 (Phase 3)**: Can start immediately — all 3 tasks are independent
- **User Story 2 (Phase 4)**: Can start immediately — all 5 tasks are independent, no dependency on US1
- **User Story 3 (Phase 5)**: Depends on US1 + US2 completion (verification pass)
- **Polish (Phase 6)**: Depends on US3 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — storefront skeletons are independent
- **User Story 2 (P1)**: No dependencies — admin skeletons are independent
- **User Story 3 (P2)**: Depends on US1 + US2 (verifies their output)

### Parallel Opportunities

All tasks within US1 (T001–T003) can run in parallel.
All tasks within US2 (T004–T008) can run in parallel.
US1 and US2 can run in parallel with each other.

---

## Parallel Example: All Creation Tasks

```bash
# All 8 loading.tsx files can be created in parallel (different files, no dependencies):
Task T001: "Create homepage skeleton in src/app/loading.tsx"
Task T002: "Create categories skeleton in src/app/categories/loading.tsx"
Task T003: "Create category detail skeleton in src/app/category/[slug]/loading.tsx"
Task T004: "Create admin dashboard skeleton in src/app/admin/loading.tsx"
Task T005: "Create admin new product skeleton in src/app/admin/products/new/loading.tsx"
Task T006: "Create admin edit product skeleton in src/app/admin/products/[id]/edit/loading.tsx"
Task T007: "Create admin new category skeleton in src/app/admin/categories/new/loading.tsx"
Task T008: "Create admin edit category skeleton in src/app/admin/categories/[id]/edit/loading.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001–T003 (storefront skeletons) — all parallelizable
2. **STOP and VALIDATE**: Test all 3 storefront pages with artificial delay
3. Deploy/demo if ready — customer-facing pages are covered

### Incremental Delivery

1. Add US1 (storefront) → Test → Deploy (MVP!)
2. Add US2 (admin) → Test → Deploy
3. Run US3 (verification) → Refine → Deploy
4. Run Polish → Final validation → Complete

---

## Notes

- All 8 creation tasks are parallelizable — they each create a new file in a different directory
- Each `loading.tsx` file is completely self-contained with no cross-file dependencies
- Storefront skeletons include `<Navbar />` + `<Footer />` (matching existing `/product/[slug]/loading.tsx` pattern)
- Admin skeletons are content-only (sidebar + header come from `/admin/layout.tsx`)
- All skeletons reuse `<Skeleton />` from `@/components/ui/Skeleton`
