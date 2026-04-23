# Feature Specification: Skeleton Loading States

**Feature Branch**: `018-skeleton-loading`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "Add more loading and skeleton loading to the app — check which pages/functions have no loading or skeleton and implement it"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Storefront Pages Show Skeleton Loading (Priority: P1)

A shopper navigates to a storefront page (homepage, categories listing, or a category detail page). While the server fetches products and category data, the page immediately renders a skeleton placeholder that matches the final page layout — instead of a blank white screen or a frozen browser tab.

**Why this priority**: Storefront pages are customer-facing and directly impact perceived performance and first impressions. A blank screen on the homepage or category page gives the impression that the site is broken.

**Independent Test**: Navigate to the homepage, the `/categories` page, and any `/category/[slug]` page on a slow connection (or with artificial latency) and verify that skeleton placeholders appear instantly before the real content loads.

**Acceptance Scenarios**:

1. **Given** a shopper loads the homepage for the first time, **When** the page is fetching product data from the database, **Then** a skeleton layout is displayed showing placeholder shapes for the hero section, product grid cards, and featured categories section.
2. **Given** a shopper navigates to the `/categories` page, **When** the server is fetching category data, **Then** a skeleton layout displays placeholder cards matching the categories grid layout.
3. **Given** a shopper navigates to a `/category/[slug]` page, **When** the server is fetching products and filter data, **Then** a skeleton layout displays a placeholder for the category header, filter sidebar, and product grid.

---

### User Story 2 — Admin Dashboard Shows Skeleton Loading (Priority: P1)

An admin user navigates to the admin dashboard, product/category creation forms, or product/category edit forms. While the server fetches stats or form data, skeleton placeholders are displayed that match the final layout.

**Why this priority**: Admin pages fetch data from the database (counts, product details, category lists). Without loading states, the admin sees a blank page or layout shift, which is disorienting — especially on slower database connections.

**Independent Test**: Navigate to `/admin`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/categories/new`, and `/admin/categories/[id]/edit` with artificial latency and verify that skeleton placeholders appear immediately.

**Acceptance Scenarios**:

1. **Given** an admin navigates to the dashboard (`/admin`), **When** the server is fetching stats (product counts, category counts), **Then** skeleton cards matching the stat card layout are displayed.
2. **Given** an admin navigates to create a new product (`/admin/products/new`), **When** the server is fetching the category list for the form dropdown, **Then** a skeleton matching the form layout is displayed.
3. **Given** an admin navigates to edit a product (`/admin/products/[id]/edit`), **When** the server is fetching the product data and category list, **Then** a skeleton matching the form layout with image gallery placeholder is displayed.
4. **Given** an admin navigates to create or edit a category (`/admin/categories/new` or `/admin/categories/[id]/edit`), **When** the server is fetching form data, **Then** a skeleton matching the category form layout is displayed.

---

### User Story 3 — Skeleton Layouts Match Final Content Shape (Priority: P2)

The skeleton loading states across all pages visually mirror the actual content layout — matching widths, heights, grid structures, and spacing — so the transition from skeleton to real content is seamless without jarring layout shifts.

**Why this priority**: Poorly shaped skeletons (e.g., a single full-width bar for a 4-column grid) are worse than no skeleton at all because they cause Cumulative Layout Shift (CLS), which degrades the user experience and SEO scores.

**Independent Test**: Compare the skeleton layout side-by-side with the loaded page and verify that major content blocks (cards, forms, headers, images) have matching dimensions and positions.

**Acceptance Scenarios**:

1. **Given** any page with a skeleton state, **When** the real content loads and replaces the skeleton, **Then** there is zero visible layout shift — the content appears to "paint in" over the skeleton shapes.
2. **Given** the homepage skeleton, **When** compared to the loaded homepage, **Then** the product grid skeleton has the same number of columns and card proportions as the real grid.
3. **Given** the admin form skeleton, **When** compared to the loaded form, **Then** input placeholders match the height and spacing of the real form fields.

---

### Edge Cases

- What happens when a page loads extremely fast (cached data)? The skeleton should still render momentarily without causing a flash.
- What happens when navigation occurs via client-side routing (Next.js Link)? The skeleton should appear during the server-component data fetch phase.
- What happens on a page with dynamic content (e.g., search results on homepage)? The skeleton should represent the default layout regardless of search params.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a skeleton loading state for the storefront homepage (`/`) while products and categories are being fetched.
- **FR-002**: System MUST display a skeleton loading state for the categories listing page (`/categories`) while category data is being fetched.
- **FR-003**: System MUST display a skeleton loading state for the category detail page (`/category/[slug]`) while products, filters, and category metadata are being fetched.
- **FR-004**: System MUST display a skeleton loading state for the admin dashboard (`/admin`) while aggregate statistics are being fetched.
- **FR-005**: System MUST display a skeleton loading state for the admin product creation page (`/admin/products/new`) while form prerequisite data is being fetched.
- **FR-006**: System MUST display a skeleton loading state for the admin product edit page (`/admin/products/[id]/edit`) while the product and form data are being fetched.
- **FR-007**: System MUST display a skeleton loading state for the admin category creation page (`/admin/categories/new`) while form prerequisite data is being fetched.
- **FR-008**: System MUST display a skeleton loading state for the admin category edit page (`/admin/categories/[id]/edit`) while category data is being fetched.
- **FR-009**: Each skeleton layout MUST visually match the structure of the corresponding loaded page (same grid columns, card proportions, form field spacing).
- **FR-010**: Skeleton states MUST use a consistent shimmer/pulse animation across all pages.
- **FR-011**: Skeleton states MUST include the page's persistent chrome (navigation bar, footer, admin sidebar) as real rendered elements — not as skeleton placeholders.
- **FR-012**: The existing `Skeleton` UI component MUST be reused for all skeleton loading states for visual consistency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 identified pages without loading states have a skeleton loading state implemented.
- **SC-002**: Skeleton states appear within 100ms of navigation — users never see a blank white page during data fetching.
- **SC-003**: Transition from skeleton to real content produces no visible layout shift (CLS impact < 0.05).
- **SC-004**: All skeleton states use the same pulse animation and color scheme for visual consistency.

## Assumptions

- The existing `Skeleton` UI component (`src/components/ui/Skeleton.tsx`) provides the correct visual style and will be reused.
- The existing `Navbar`, `Footer`, and admin sidebar layout render instantly (they don't need skeleton states themselves since they don't fetch data or are already client components).
- Pages that already have `loading.tsx` files (`/admin/categories`, `/admin/products`, `/product/[slug]`) are considered complete and are out of scope.
- The admin login page (`/admin/login`) is a client component with no server-side data fetching and does not need a skeleton state.
- The admin test-upload page is a development tool and does not need a skeleton state.
