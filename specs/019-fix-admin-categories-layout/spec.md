# Feature Specification: Fix Admin Subcategory Display & Sidebar Layout

**Feature Branch**: `019-fix-admin-categories-layout`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "In the categories page in the admin panel there is a problem that whenever I click on the subcategories button of any category it doesn't show its real subcategories however they all show the same subcategories so this is not right. Also I want the sidebar of the admin panel to be always mounted and the screen on the right is what can be scrollable if needed."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Correct Subcategory Display Per Category (Priority: P1)

An admin navigates to the Categories page in the admin panel to manage product categories. The admin clicks the "Subcategories" button on a specific main category (e.g., "Living Room"). The system displays only the subcategories that belong to that selected category (e.g., "Sofas", "Coffee Tables"), not subcategories from other categories. When the admin then clicks "Subcategories" on a different category (e.g., "Bedroom"), the system correctly shows that category's own subcategories (e.g., "Beds", "Nightstands").

**Why this priority**: This is a data integrity bug — displaying incorrect subcategories misleads admins and could lead to accidental edits or deletions on the wrong items. Fixing this is critical for correct admin workflow.

**Independent Test**: Can be fully tested by creating multiple categories each with distinct subcategories, then clicking the "Subcategories" button on each and verifying the correct children appear.

**Acceptance Scenarios**:

1. **Given** the admin panel has Category A with subcategories A1, A2 and Category B with subcategories B1, B2, **When** the admin clicks "Subcategories" on Category A, **Then** only A1 and A2 are displayed in the subcategory list.
2. **Given** the admin is viewing subcategories of Category A, **When** the admin clicks "Subcategories" on Category B, **Then** the subcategory list updates to show only B1 and B2.
3. **Given** a category has no subcategories, **When** the admin clicks "Subcategories" on that category, **Then** an empty state message is shown with an option to create a subcategory under that parent.
4. **Given** the admin is viewing subcategories of a category, **When** the admin clicks the same "Subcategories" button again (or clicks "Close"), **Then** the subcategory panel collapses/hides.

---

### User Story 2 - Fixed Sidebar with Scrollable Content Area (Priority: P2)

An admin is working on the admin panel and needs to navigate between different sections (Dashboard, Categories, Products) while scrolling through long content. The sidebar remains fixed in place on the left side of the screen at all times, regardless of how far the admin scrolls in the main content area. Only the right-side content area scrolls when the page content exceeds the viewport height.

**Why this priority**: This is a usability improvement that ensures persistent navigation access. It prevents the sidebar from scrolling out of view, which is a standard expectation in admin dashboards.

**Independent Test**: Can be tested by navigating to any admin page with content longer than the viewport height, scrolling down, and verifying the sidebar remains visible and interactive while only the content area scrolls.

**Acceptance Scenarios**:

1. **Given** the admin is on any admin panel page, **When** the content area has content taller than the viewport, **Then** only the right-side content area is scrollable and the sidebar stays fixed in place.
2. **Given** the admin is scrolling through long content, **When** they look at the sidebar, **Then** the sidebar remains fully visible with all navigation links accessible.
3. **Given** the admin is on a mobile-sized viewport, **When** they view the admin panel, **Then** the sidebar behaves appropriately for the mobile layout (e.g., collapses or remains at top) and the content area remains the primary scrollable region.
4. **Given** the sidebar has navigation items, **When** the admin clicks a navigation link in the sidebar while scrolled down in content, **Then** the navigation works correctly and the new page loads with content scrolled to the top.

---

### User Story 3 - N-level Category Nesting & Navigation (Priority: P1)

An admin needs to manage complex category hierarchies (e.g., Furniture > Living Room > Sofas > Sectionals). The admin can click the "Subcategories" button on any category at any level to drill down into its children. The system provides breadcrumb navigation above the child categories table, allowing the admin to see their current depth and navigate back to any parent level easily.

**Why this priority**: Without this, admins cannot manage deep hierarchies, making the category system limited and potentially inconsistent with the desired product organization.

**Independent Test**:
- Navigate to Categories.
- Click "Subcategories" on a main category.
- Click "Subcategories" on one of its children.
- Verify the children of the subcategory are displayed.
- Use breadcrumbs to navigate back up one level and then to the top.

**Acceptance Scenarios**:

1. **Given** a hierarchy Category A > Sub-A1 > Sub-Sub-A1-1, **When** the admin clicks "Subcategories" on Sub-A1, **Then** Sub-Sub-A1-1 is displayed in the list.
2. **Given** the admin is viewing Sub-Sub-A1-1, **When** the admin looks above the table, **Then** they see breadcrumbs: "Categories > Category A > Sub-A1".
3. **Given** the admin is viewing a deep level, **When** the admin clicks a parent name in the breadcrumbs, **Then** the view updates to show the children of that parent.
4. **Given** the admin is at any level, **When** they click "Add Category", **Then** the new category defaults to the current parent level.

---

### Edge Cases

- What happens when the admin panel is resized from desktop to mobile width while a subcategory panel is open? (Sidebar should collapse into hamburger menu automatically)
- How does the system handle a category whose subcategories were deleted while the subcategory panel is still open?
- What happens when the sidebar navigation items exceed the sidebar height on very small screens?
- How does the fixed sidebar behave when the browser zoom level is very high?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display only the subcategories that belong to the selected parent category when the "Subcategories" button is clicked.
- **FR-010**: System MUST support unlimited levels of category nesting (drill-down).
- **FR-011**: System MUST provide breadcrumb navigation when viewing subcategories to allow moving back up the hierarchy.
- **FR-012**: System MUST display the sum of products from a category and all its descendants in the category list.
- **FR-013**: System MUST search across all category levels when a search query is active, displaying results in a flat list with hierarchical context.
- **FR-002**: System MUST update the displayed subcategories immediately when the admin selects a different parent category or breadcrumb.
- **FR-003**: System MUST show an empty state with a "Create" option when a selected category has zero subcategories.
- **FR-004**: System MUST keep the admin panel sidebar always visible and fixed on the screen regardless of content scroll position (on desktop viewports).
- **FR-005**: System MUST make only the right-side content area scrollable when content exceeds the viewport height.
- **FR-009**: System MUST collapse the sidebar into a toggleable hamburger menu on mobile viewports (<768px), overlaying the content when opened.
- **FR-008**: System MUST keep the admin header bar fixed/sticky at the top of the content area, always visible regardless of content scroll position.
- **FR-006**: System MUST maintain sidebar navigation functionality while the content area is scrolled to any position.
- **FR-007**: System MUST preserve the existing sidebar behavior on the login page (sidebar hidden on login).

### Key Entities

- **Category**: A product grouping entity with a name, optional parent reference, display order, and featured flag. Categories can be top-level (main categories) or nested (subcategories) via a parent-child relationship.
- **Subcategory**: A category that has a parent category assigned. Each subcategory belongs to exactly one parent category.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of category "Subcategories" button clicks display only the correct children belonging to that specific category, regardless of nesting depth.
- **SC-005**: Admin can navigate back to any parent level using breadcrumbs in a single click.
- **SC-002**: Admin sidebar remains visible and accessible at all scroll positions on desktop viewports during 100% of admin panel usage.
- **SC-003**: Content area scrolls independently from the sidebar with no visual artifacts or layout shifts.
- **SC-004**: Admin can navigate between all admin sections from the sidebar without scrolling back to the top of the page.

## Assumptions

- The existing category data model (parent-child relationship via `parentId`) is correct and does not need schema changes.
- The bug is a front-end rendering issue where the subcategory filtering logic is not correctly isolating children per selected parent, not a data/API issue.
- The sidebar fix applies primarily to desktop/tablet viewports (≥768px). On mobile, the sidebar collapses into a hamburger menu.
- The admin header bar at the top of the content area stays fixed/sticky — it remains visible at all times above the scrollable content region.

## Clarifications

### Session 2026-04-23

- Q: Should the admin header stay fixed or scroll with the content? → A: Header stays fixed (sticky) — always visible above the content area.
- Q: How should the sidebar behave on mobile? → A: Collapse into a hamburger/toggle menu that overlays when opened.
