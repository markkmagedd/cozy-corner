# Technical Research: Navbar Redesign

## Goal
Design and implement a premium, high-aesthetic "sticky" navbar for Cozy Corner that simplifies navigation and removes obsolete elements (like Cart links).

## Visual Inspiration & Design Decisions

### 1. Aesthetic Direction: "Modern Glassmorphism"
- **Background**: `bg-white/70` with `backdrop-blur-xl`.
- **Border**: Thin, high-contrast bottom border (`border-slate-200/50`).
- **Surface**: Subtle linear gradient (`bg-linear-to-b from-white to-slate-50/50`).
- **Typography**: Utilize the existing `Playfair Display` for the logo and `Inter` (sans-serif) for navigational links to create a "boutique" high-end feel.

### 2. Layout Strategy
- **Left**: Clear, elegant branding (`font-serif`) and primary categories.
- **Center**: (Optional) Secondary promotional message or purely whitespace for aesthetic "breathing room".
- **Right**: Integrated, sleek SearchBar and Profile/Account icon (if needed, but for now focus on cleanup).

### 3. Navigation Cleanup
- **Remove**: All Cart icon code and logic (since there is no cart functionality yet).
- **Remove**: Any placeholder links (e.g., "Blog", "Sale") that do not have active routes.
- **Maintain**: "Shop", "Categories", "Home".

### 4. Component Breakdown & Refinements

#### Navbar (src/components/storefront/Navbar.tsx)
- Transition from static/border-heavy design to a more "floating" and translucent appearance.
- Enhance the mobile menu drawer to include glassmorphism and subtle reveal animations.
- Ensure strict compliance with the **Sticky Header** requirement using Tailwind's `sticky top-0`.

#### MegaMenu (src/components/storefront/MegaMenu.tsx)
- Current version uses basic absolute positioning and hover.
- Refinement: Add `framer-motion` for smooth opacity and scale entry/exit.
- Improve the multi-column layout for "All Categories" vs. "Curated Collections".

## Alternatives Considered
- **Option B: Centered Navigation**: Too cluttered for desktop viewports with search integrated.
- **Option C: Dark Mode Default**: Project currently defaults to a light-themed boutique aesthetic.

## Decision
Proceed with **Glassmorphic Sticky Header** using `backdrop-blur` and a simplified navigation link set. Remove all Cart references.
