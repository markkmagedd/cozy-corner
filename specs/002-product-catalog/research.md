# Research & Technical Decisions: 002-product-catalog

## 1. Next.js App Router Architecture
- **Decision**: Use Next.js App Router (`app/`) with React Server Components (where applicable) and Client Components for interactive UI (animations, filters).
- **Rationale**: Requested in spec. App router provides excellent performance for mobile-first apps, and seamless support for handling URL params natively for persistence.
- **Alternatives considered**: Pages router (legacy, not recommended for new modern apps).

## 2. Animation Library
- **Decision**: Use `framer-motion` for complex animations (page transitions, card entrances, layout animations) and Tailwind CSS utility classes for simple micro-interactions (hover states, tap feedback).
- **Rationale**: Framer Motion is the industry standard for fluid, modern React animations (as requested by "LC Waikiki aesthetic"). It handles unmounting/mounting gracefully.
- **Alternatives considered**: Pure CSS transitions (harder to orchestrate page transitions and layout changes).

## 3. Mock Data Storage
- **Decision**: Store mock data in a TypeScript file (`src/data/mock-products.ts` or `src/data/products.json`) exported as a typed array.
- **Rationale**: Easy to edit without a backend. Allows simulating API calls with `setTimeout` to mimic network latency for infinite scroll.
- **Alternatives considered**: LocalStorage (too complex to pre-seed), embedded strictly in components (violates separation of concerns).

## 4. Infinite Scroll Implementation
- **Decision**: Use `react-intersection-observer` (or native browser IntersectionObserver) triggered at the bottom of the active list to load the next chunk of products.
- **Rationale**: Most reliable standard for infinite scrolling in React. Can append items to standard state array and trigger Framer Motion entrance animations.
- **Alternatives considered**: Listening to raw window scroll events (poor performance, janky).

## 5. UI/UX Component Foundation
- **Decision**: Build bespoke components using Tailwind CSS without heavy UI frameworks (like MUI or AntD).
- **Rationale**: The spec requests a very specific, premium, and custom mobile-first aesthetic directly referencing a retail storefront. Heavy UI frameworks often introduce override challenges.
- **Alternatives considered**: Radix UI / shadcn/ui (could use headless primitives for accessibility, but building custom cards and tabs might be simpler for this specific brief).

## 6. URL Parameter Filter Persistence
- **Decision**: Use Next.js `useRouter` and `useSearchParams` (Client Component) to update and read the `?category=slug` URL parameter.
- **Rationale**: Adheres exactly to the spec Clarifications. Allows sharing links and preserving state when navigating "back" from the detail page.
- **Alternatives considered**: React Context or Redux (would lose state on direct link sharing or hard refresh).
