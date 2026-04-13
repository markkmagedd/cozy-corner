# Phase 0: Research

## Prisma Recursive Aggregation Capability

**Context:** We need to fetch products assigned to a main category OR any of its descendants at infinite depth. The `Category` model uses an adjacency list (`parentId`). Prisma does not natively support true arbitrary depth recursive CTEs directly in the query builder.

**Decision:** We will fetch the category records, collect the IDs of the target category and all its descendants transversing them recursively in-memory, and then query the `Product` table using `where: { categoryId: { in: descendantIds } }`. We can optimize this by pre-fetching all categories in one query or using a caching mechanism if needed, since the `Category` table is very small for an e-commerce platform.

**Rationale:** Utilizing a raw SQL recursive CTE would require bypassing Prisma's type-safety and make the main product query builder (which handles pagination, filtering, variants, etc.) much more complex or partially raw SQL. Given that category tables rarely exceed a few hundred rows, loading them or traversing the adjacency list is extremely fast, fully type-safe, and plays perfectly with Prisma's existing `in` array operator.

**Alternatives considered:** 
- Raw SQL with recursive CTE: Rejected because it sacrifices Prisma's robust typing and query building capabilities seamlessly utilized in other parts of the codebase.
- Hardcoding multiple levels with nested Includes (e.g., `include: { children: { include: { children: true } } }`): Rejected because it enforces a hard depth constraint, defeating the "infinite depth" capability defined in the spec.
