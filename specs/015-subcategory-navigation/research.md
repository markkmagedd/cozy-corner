# Research & Technical Decisions: Subcategory Navigation

## Technical Context Unknowns Resolution

The specification context was highly rigorous, so formal dispatch of research agents was unnecessary. Below is a consolidation of architectural resolutions:

**Decision**: Next.js App Router Server Components for Data Fetching
- **Rationale**: Meets the Strict "SC-002: Zero Layout shift and instant client side render" criterion safely. The active route `page.tsx` for a subcategory will fetch its siblings via Prisma during the same initial request. 
- **Alternatives considered**: Client-side `useSWR` fetching was rejected due to latency impact and visual skeleton loading requirements, contradicting the spec.

**Decision**: Reusable Component Abstraction (`SubcategoryNav.tsx`)
- **Rationale**: Spec mandates re-using the exact layout/styling from the main category page. Creating a standalone component prevents code duplication while allowing `page.tsx` to remain clean.
- **Alternatives considered**: Inline map rendering directly in the App Router page was rejected for violating DRY.

**Decision**: DB Query Optimization
- **Rationale**: Using Prisma, doing `findMany` where `parentId` equals the current subcategory's `parentId` and `id` is not equal to current `id` ensures only siblings are fetched smoothly.
- **Alternatives considered**: Doing multiple hierarchical queries would be too slow.
