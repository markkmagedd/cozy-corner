# Implementation Tasks: Fix Admin Subcategory Display & Sidebar Layout

**Branch**: `019-fix-admin-categories-layout`
**Plan**: [plan.md](./plan.md)
**Spec**: [spec.md](./spec.md)

## Phase 1: Setup

*No shared infrastructure tasks.*

## Phase 2: Foundational

*No foundational/blocking tasks. We can proceed directly to user stories.*

## Phase 3: User Story 1 - Correct Subcategory Display Per Category (Priority: P1)

**Story Goal**: Ensure that when an admin clicks the "Subcategories" button for a category, only that specific category's children are shown in the subcategory table.

**Independent Test**:
- Open the admin categories page.
- Expand a category that has subcategories.
- Note the subcategories displayed.
- Expand a different category with different subcategories.
- The table should accurately reflect the new parent's subcategories.

**Implementation Tasks**:
- [X] T001 [US1] Fix state synchronization in SortableDataTable to correctly react to `data.items` prop changes in `src/components/admin/SortableDataTable.tsx`
- [X] T006 [US3] Implement hierarchical selection path state and breadcrumb navigation in `src/app/admin/categories/CategoryListClient.tsx`
- [X] T007 [US3] Add "Subcategories" button to sub-category columns to allow further drill-down in `src/app/admin/categories/CategoryListClient.tsx`
- [X] T008 [US3] Implement recursive product count calculation in `src/app/admin/categories/CategoryListClient.tsx`
- [X] T009 [US3] Implement global search mode with hierarchical context in `src/app/admin/categories/CategoryListClient.tsx`

## Phase 4: User Story 2 - Fixed Sidebar with Scrollable Content Area (Priority: P2)

**Story Goal**: Implement a fixed sidebar, a sticky admin header, and a scrollable content area for desktop, and a collapsible hamburger menu for the sidebar on mobile.

**Independent Test**:
- Desktop: Scroll down a long page (like the categories list). The sidebar and the header must remain in place while the content scrolls.
- Mobile: Shrink viewport to <768px. The sidebar should hide behind a hamburger menu. Toggling the menu should show the sidebar navigation.

**Implementation Tasks**:
- [X] T002 [US2] Update admin layout structure to use `h-screen overflow-hidden` and scope scrolling to the content panel in `src/app/admin/layout.tsx`
- [X] T003 [US2] Update the AdminHeader component to be sticky at the top of the content panel in `src/components/admin/AdminHeader.tsx`
- [X] T004 [US2] Implement mobile hamburger toggle and responsive drawer styles in `src/components/admin/AdminSidebar.tsx`

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T005 Verify mobile sidebar overlay z-index correctly overlaps the admin header and content in `src/components/admin/AdminSidebar.tsx`

## Dependencies

- Phase 3 (US1) and Phase 4 (US2) are completely independent and can be executed in any order.
- T005 depends on T004.

## Parallel Execution Examples

- **Example 1**: One developer works on T001 (US1 bug fix) while another works on T002-T004 (US2 layout redesign).

## Implementation Strategy

1. Fix the subcategory rendering bug first (US1) as it's a critical data-integrity issue for admins.
2. Implement N-level nesting and breadcrumbs (US3) to allow managing deep category hierarchies.
3. Implement the layout fixes (US2) starting from the outer wrapper (`layout.tsx`), then applying stickiness to the header, and finally addressing the responsive sidebar behavior.
