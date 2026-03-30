# Tasks: Homepage Redesign

**Input**: Design documents from `/specs/007-homepage-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

None required. The project is already fully configured with Next.js, TailwindCSS, Prisma, and all dependencies.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

None required. The existing Category model with `isFeatured` and `displayOrder` fields is already in place. No migrations or schema changes needed.

---

## Phase 3: User Story 1 - Remove Filters from New Arrivals (Priority: P1) 🎯 MVP

**Goal**: Remove the FilterSidebar from the homepage New Arrivals section and make the product grid span the full container width.

**Independent Test**: Load the homepage, confirm no filter sidebar is visible, and the product grid is full-width on all viewports.

### Implementation for User Story 1

- [x] T001 [US1] Remove the `FilterSidebar` import and its `<FilterSidebar />` JSX usage from `src/app/page.tsx`, and update the product grid wrapper to remove the flex row layout so the `ProductGrid` renders at full container width.

**Checkpoint**: Homepage shows New Arrivals at full width with no filter sidebar. FilterSidebar.tsx file still exists for other pages.

---

## Phase 4: User Story 2 - Featured Categories Section (Priority: P2)

**Goal**: Add a visually appealing section below New Arrivals that displays categories marked as featured, each linking to its category page.

**Independent Test**: Load the homepage, scroll past New Arrivals, and confirm featured categories appear in a card grid with clickable links to `/category/{slug}`.

### Implementation for User Story 2

- [x] T002 [P] [US2] Create the `FeaturedCategories` component in `src/components/storefront/FeaturedCategories.tsx` that accepts a categories array prop and renders a responsive grid of category cards with names, optional descriptions, and links to `/category/{slug}`. Include an empty-state fallback when no categories are provided. Style using TailwindCSS with hover effects consistent with existing product cards.
- [x] T003 [US2] Add a Prisma query in `src/app/page.tsx` to fetch categories where `isFeatured` is `true`, ordered by `displayOrder` ascending. Import and render the `<FeaturedCategories />` component below the New Arrivals section, passing the fetched categories as props.

**Checkpoint**: Homepage displays featured categories beneath New Arrivals. Clicking a category navigates to `/category/{slug}`.

---

## Phase 5: User Story 3 - Promotional Banner Section (Priority: P3)

**Goal**: Add a static promotional banner with a headline, description, and CTA button beneath the Featured Categories section.

**Independent Test**: Load the homepage, scroll past the categories section, and confirm a visually distinct promotional banner is rendered with a headline, supporting text, and a clickable CTA button.

### Implementation for User Story 3

- [x] T004 [P] [US3] Create the `PromoBanner` component in `src/components/storefront/PromoBanner.tsx` with hardcoded static content: a compelling headline, description paragraph, and at least one CTA link/button. Style with TailwindCSS using a contrasting background (e.g., accent color or gradient) to visually distinguish it from surrounding sections.
- [x] T005 [US3] Import and render the `<PromoBanner />` component in `src/app/page.tsx` below the Featured Categories section.

**Checkpoint**: Homepage displays a promotional banner beneath the categories. CTA button navigates to its target page.

---

## Phase 6: User Story 4 - Newsletter Signup Section (Priority: P4)

**Goal**: Add a newsletter signup form with email input, validation, and client-side success feedback near the bottom of the homepage.

**Independent Test**: Load the homepage, scroll to the newsletter section, enter an invalid email and confirm an error shows, then enter a valid email and confirm a success message appears.

### Implementation for User Story 4

- [x] T006 [P] [US4] Create the `NewsletterSignup` client component in `src/components/storefront/NewsletterSignup.tsx` with `"use client"` directive. Implement an email input field with HTML5 email validation, a submit button, inline validation error display for invalid emails, and a success confirmation message on valid submission using React useState. Style with TailwindCSS using a background that complements the page design (e.g., subtle slate tone or primary color).
- [x] T007 [US4] Import and render the `<NewsletterSignup />` component in `src/app/page.tsx` below the Promotional Banner section and above the `<Footer />`.

**Checkpoint**: Homepage displays a newsletter signup form. Invalid emails show errors; valid emails show a success message.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and responsive testing

- [x] T008 Run quickstart.md verification steps to confirm all sections render correctly, in the correct order (Hero → New Arrivals → Featured Categories → Promo Banner → Newsletter → Footer), and are fully responsive across mobile, tablet, and desktop viewports.

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 3)**: Can start immediately — no dependencies.
- **User Story 2 (Phase 4)**: Depends on US1 completion (page.tsx is being modified).
- **User Story 3 (Phase 5)**: Depends on US2 completion (page.tsx ordering matters).
- **User Story 4 (Phase 6)**: Depends on US3 completion (page.tsx ordering matters).
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent — modifies page.tsx layout.
- **User Story 2 (P2)**: T002 (component) can be built in parallel with US1; T003 depends on US1 (page.tsx changes).
- **User Story 3 (P3)**: T004 (component) can be built in parallel with US1/US2; T005 depends on US2.
- **User Story 4 (P4)**: T006 (component) can be built in parallel with US1/US2/US3; T007 depends on US3.

### Parallel Opportunities

- T002, T004, and T006 are all marked [P] — they create new standalone component files and can be developed simultaneously.
- Integration tasks (T003, T005, T007) must run sequentially since they all modify the same file (`page.tsx`).

---

## Parallel Example: Component Creation

```bash
# These three component creation tasks can all run in parallel:
Task T002: "Create FeaturedCategories component in src/components/storefront/FeaturedCategories.tsx"
Task T004: "Create PromoBanner component in src/components/storefront/PromoBanner.tsx"
Task T006: "Create NewsletterSignup component in src/components/storefront/NewsletterSignup.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (remove filter sidebar).
2. **STOP and VALIDATE**: Test homepage is clean with full-width product grid.
3. Proceed to additional stories.

### Incremental Delivery

1. US1: Remove filters → Validate → Clean homepage (MVP!)
2. US2: Add categories → Validate → Navigation improvement
3. US3: Add promo banner → Validate → Marketing value
4. US4: Add newsletter → Validate → Engagement mechanism
5. Each story adds value without breaking previous stories.
