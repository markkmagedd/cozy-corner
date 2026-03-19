# Phase 0: Outline & Research

## Next.js UI Component Architecture Strategy

**Decision**: Separate generic UI primitives (`SlideOver`, `Modal`) from domain-specific feature components (`HeroBanner`, `CategoryGrid`). State for modals will be managed locally via `useState` in the client components since there is no complex routing required.
**Rationale**: Keeps the codebase clean and modular. A modular component structure easily accommodates future data hooks while isolating presentation logic.
**Alternatives considered**: Managing all state in `app/page.tsx` (too monolithic, causes unnecessary re-renders).

## Tailwind CSS Theme Constraints

**Decision**: Hardcode standard hex colors into Tailwind config for the "pastel" palette instead of relying on generic utilities to ensure brand consistency. Force Light Mode styling by omitting `dark:` variants and stripping `color-scheme` preferences if necessary.
**Rationale**: Spec explicitly demands a strict Light Mode MVP and requires distinct pastel color blocks. Hand-picking pastel hexes ensures they don't clash.
**Alternatives considered**: Using dynamic CSS variables (too complex for MVP).

## Skeleton Loader Implementation

**Decision**: Create a generic responsive `Skeleton.tsx` using Tailwind's `animate-pulse` utility.
**Rationale**: Meets the requirement FR-009 to implement asynchronous loading skeletons natively without installing third-party spinner components.
**Alternatives considered**: Using generic spinner SVGs (skeletons provide a better modern UX, as requested).
