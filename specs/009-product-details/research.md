# Research: Product Details Page

## Rendering Strategy & SEO
- **Decision:** Use Next.js React Server Components (`app/[slug]/page.tsx` or similar) combined with Dynamic Metadata Generation (`generateMetadata`).
- **Rationale:** Meets the SSR/SSG requirements strictly defined in the spec for optimal SEO and sub-1.5s page loads. Server Components allow direct server-side calls to the Prisma database without creating artificial client-side API barriers, which reduces latency and improves the Time to First Byte (TTFB).
- **Alternatives considered:** Client-side rendering (rejected directly due to SEO constraints and slower initial First Contentful Paint).

## Variant Selection State Handling
- **Decision:** Use URL query parameters (e.g., `?color=Red&size=Large`) to store and manage the currently selected variant state.
- **Rationale:** URL state is natively shareable, deep-linkable, and plays beautifully with SSR. When a user changes a variant, the client can push a new URL (via `<Link>` or `useRouter`) allowing the page to either handle it locally or let the server directly re-render the specifically requested variant data. This avoids complex client-side global state management overhead and enables reliable server-side SEO logic for specific variant pages if needed.
- **Alternatives considered:** React `useState` in a Client Component (rejected because it breaks shareability and makes server-side rendering of a requested specific variant much harder).
