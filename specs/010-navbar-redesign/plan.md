# Implementation Plan: Navbar Redesign

**Branch**: `010-navbar-redesign` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-navbar-redesign/spec.md`

## Summary

The goal is to recreate the `Navbar` component in the `cozy-corner` storefront to improve its aesthetic appeal, simplify navigation, and remove redundant or broken links. The design will follow modern web design principles (glassmorphism, vibrant colors, premium typography) and include a "sticky" header behavior for persistent access.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16.2.1  
**Primary Dependencies**: Tailwind CSS 4, Lucide React (icons), Framer Motion (for animations - to be added), clsx/tailwind-merge  
**Storage**: N/A (UI only, uses existing `/api/categories` for menu data)  
**Testing**: Manual visual testing (as specified in User Stories)  
**Target Platform**: Browser (Responsive: Desktop, Mobile, Tablet)
**Project Type**: Web application (storefront)  
**Performance Goals**: Sub-200ms interaction latency for mobile menu and search toggle.  
**Constraints**: Sticky header required; NO cart functionality (remove any cart related code).  
**Scale/Scope**: Replace existing `src/components/storefront/Navbar.tsx` and `MegaMenu.tsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Project Structure**: Follows Next.js App Router conventions.
- [x] **Design Alignment**: Plan includes rich aesthetics and premium design as per system instructions.
- [x] **Simplicity**: Target is to remove unnecessary links and simplify the UX.

## Project Structure

### Documentation (this feature)

```text
specs/010-navbar-redesign/
├── plan.md              # This file
├── research.md          # Visual inspiration and component breakdown
├── data-model.md        # N/A (UI only)
└── quickstart.md        # How to run dev server to see changes
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css      # Design tokens for Navbar
├── components/
│   ├── storefront/
│   │   ├── Navbar.tsx   # Core modification
│   │   ├── MegaMenu.tsx # Core modification
│   │   ├── SearchBar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
```

**Structure Decision**: Modifying existing `storefront` components in place to maintain integration with `app/page.tsx` and other route layouts.

## Phase 0: Outline & Research

1. **Research visual inspiration**: Find modern "premium" navbar designs (e.g., Apple-style glassmorphism, Stripe-style mega menus).
2. **Component Breakdown**: Identify elements of the existing `Navbar` to be removed (Cart links) and elements to be enhanced (Typography, Spacing).
3. **Animation Strategy**: Plan subtle micro-animations for the Mega Menu and Mobile Menu using Framer Motion or CSS transitions.

## Phase 1: Design & Contracts

1. **Design Tokens**: Update `globals.css` if needed for specific navbar colors/gradients.
2. **Component Interface**: Ensure `Navbar` remains a client component and maintains its props (if any).
3. **Agent context update**: Run the update-agent-context script.

## Phase 2: Implementation

1. **Refactor Navbar.tsx**: Apply sticky behavior, glassmorphism, and modernized layout.
2. **Enhance MegaMenu.tsx**: Improve layout and styling of category links.
3. **Remove redundant links**: Clean up any dead links or Cart references.
4. **Mobile Responsiveness**: Implement a premium mobile drawer menu.
