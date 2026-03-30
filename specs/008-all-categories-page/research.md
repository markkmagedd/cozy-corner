# Research & Decisions: All Categories Page

This document captures early architectural decisions based on unresolved or vaguely specified elements in the feature request.

## Decision 1: Data Fetching and Dynamic Thumbnail Retrieval

**Context:** The spec demands that categories dynamically use their first available product's primary image as a thumbnail. Querying this naively for every category could lead to the N+1 query problem.

**Decision:** We will fetch the categories and their associated products using a single structured Prisma query in the Server Component (`page.tsx`), leveraging Prisma's `include` feature.

**Rationale:** Next.js Server Components run server-side, making direct DB queries fast. Using a `findMany` on the Category model while including the first product (via `take: 1` filter or just fetching products and mapping in JS) prevents heavy N+1 database roundtrips.

```typescript
// Conceptual Prisma Query logic
const categories = await prisma.category.findMany({
  where: { parentId: null, isActive: true }, // Top-level only
  orderBy: { displayOrder: 'asc' },
  include: {
    products: {
      take: 1, // Get representative product
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    }
  }
})
```

**Alternatives Considered:**
- *Separate API route*: Rejected to avoid internal network hopping inside App Router.
- *Separate DB calls in a loop*: Rejected due to N+1 performance issues violating SC-003.

## Decision 2: Routing Path

**Context:** The spec dictates an "all categories" page, but the exact path isn't strictly defined.

**Decision:** Route will be `/categories`.

**Rationale:** It's standard, predictable, and distinct from the existing individual category routes (`/category/{slug}`).

## Decision 3: Reusable UI Components

**Context:** The homepage has a `FeaturedCategories` component that displays categories in a grid.

**Decision:** Create a new or generalized component (`AllCategoriesGrid`) specifically for handling the data shape required here (which includes the dynamically resolved thumbnail from the product relation), instead of directly polluting the existing `FeaturedCategories` logic.

**Rationale:** The `FeaturedCategories` logic is built for categories that may or may not have an image field, while this new requirement specifically calls for resolving product primary images. Isolating the component logic maintains single-responsibility and avoids breaking the homepage layout.
