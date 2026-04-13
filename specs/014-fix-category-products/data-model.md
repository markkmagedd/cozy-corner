# Phase 1: Data Model Updates

No schema changes are required for this feature. We rely completely on the existing Prisma schema:
- `Category` acts as an adjacency list built using the `parentId` relation recursively.
- `Product` has an optional `categoryId` for linking to one specific category level.

The technical changes revolve around application-level mapping and logic to traverse the generated tree structure before finalizing the Prisma query for products.
