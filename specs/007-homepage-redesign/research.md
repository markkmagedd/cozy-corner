# Research: Homepage Redesign

## Filter sidebar removal approach

**Decision**: Remove the `<FilterSidebar />` component and its flex wrapper from `page.tsx` on the homepage only. The `FilterSidebar.tsx` component file remains untouched since it may be used on future shop/category pages.

**Rationale**: The filter sidebar is imported and rendered inline in `page.tsx`. Simply removing its import and usage from the homepage JSX is the cleanest approach — the component itself is not deleted so it remains available for other routes.

**Alternatives considered**:
- *Conditional rendering via prop*: Rejected — adds unnecessary complexity for a simple removal.
- *Deleting the component file*: Rejected — per FR-008, filters must remain available on other pages.

## Featured Categories data fetching

**Decision**: Fetch categories with `isFeatured: true` directly via Prisma in the Server Component (`page.tsx`), ordered by `displayOrder`. Pass the results as props to a `FeaturedCategories` presentational component.

**Rationale**: The Category model already has `isFeatured` (Boolean) and `displayOrder` (Int) fields with a database index on `isFeatured`. Server-side data fetching in the page component follows the existing pattern used for products.

**Alternatives considered**:
- *Client-side fetch via API route*: Rejected — unnecessary network round-trip when the page is a Server Component.
- *Static data*: Rejected — categories should be dynamic from the database per the spec.

## Promotional banner design

**Decision**: Create a static `PromoBanner` component with hardcoded headline, description, and CTA. No database or CMS integration.

**Rationale**: Per spec assumptions, the promo banner uses static content for the initial implementation. A simple presentational component keeps complexity low.

**Alternatives considered**:
- *CMS-driven content*: Rejected — explicitly out of scope per spec assumptions.

## Newsletter signup approach

**Decision**: Create a client-side `NewsletterSignup` component using `"use client"` directive. It will have an email input with HTML5 email validation and display a success message on submit via local React state. No backend integration.

**Rationale**: Per spec assumptions, the newsletter form provides client-side visual feedback only. Using `"use client"` is required for interactive form state (useState for input value, submission state, validation errors).

**Alternatives considered**:
- *Server Action for form submission*: Rejected — backend email storage is explicitly out of scope.
- *Third-party newsletter service integration*: Rejected — out of scope for this iteration.
