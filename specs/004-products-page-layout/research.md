# Phase 0: Outline & Research

## Next.js 15 App Router - URL State vs React State

- **Decision**: Use URL Search Params (`?category=id&page=2`) for pagination and category filtering.
- **Rationale**: URL state allows the page to be shareable, bookmarkable, and naturally supports standard browser back/forward navigation. Next.js App Router elegantly consumes `searchParams` in Page Server Components, enabling performant data fetching directly on the server without client round-trips.
- **Alternatives considered**: `useState` + `useEffect` fetching client-side (Rejected: inferior SEO, slower initial paint, breaks back button). Context API (Rejected: overkill for simple list variations).

## Layout Animation - Framer Motion

- **Decision**: Add a lightweight fade-in stagger motion to the `ProductGrid` and `ProductCard`.
- **Rationale**: Meets the Constitution's "Premium Aesthetics" principle without negatively impacting load times. 
- **Alternatives considered**: CSS-only transitions (Rejected: less flexible for staggered grid mounting logic).
