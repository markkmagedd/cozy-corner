# Research: Products Page Layout

## 1. Data Fetching for Infinite Scroll (Load More)
**Decision**: Use React Server Actions combined with a Client Component managing the loaded items state.
**Rationale**: Next.js 15 App Router strongly encourages Server Actions for data fetching and mutations. By passing initial data from a Server Component to a Client Component, and having the "Load More" button trigger a Server Action that fetches the next page/offset, we avoid needing extra API route overhead, while retaining high performance and hydration efficiency.
**Alternatives considered**: 
- *SWR / React Query*: Excessive for a simple manual load more button if no complex caching across multiple views is needed.
- *API Route Handlers*: Requires extra boilerplate compared to direct Server Actions.
- *URL Search Params Pagination*: Standard, but user requested manual "Load More" without losing scroll position, which is smoother via state append than a full page navigation (though Next.js handles soft navigation, appending items strictly on the client is visually simpler for infinite scroll).

## 2. Off-Canvas Drawer (Hamburger Menu) Implementation
**Decision**: Use Framer Motion for the slide-in animation and native React state for the toggle. Focus management using standard accessible dialog patterns.
**Rationale**: The constitution specifies Framer Motion for animations. It yields the smoothest 60fps animations for mobile drawers. 
**Alternatives considered**: CSS-only transitions. Rejected because Framer Motion handles unmounting/mounting gracefully with `<AnimatePresence>`, avoiding messy CSS `display: none` timeouts.
